import sys,json,zipfile,tempfile,unittest,math
from pathlib import Path
sys.path.insert(0,str(Path(__file__).parents[1]/"py_modules"))
from switch_layout import convert_layout
from switch_import import import_theme
class ConversionTests(unittest.TestCase):
 def test_animated_shadow_strength_uses_native_numeric_channel(self):
  animation={'FileName':'anim/DBaseNml_In.bflan','AnimJson':json.dumps({'pai1':{'FrameSize':8,'Entries':[{'Name':'P_Base','Tags':[{'TagType':'FLEU','Entries':[{'AnimationTarget':0,'Index':0,'FLEUEntryName':'S_DropShadowVolume','DataType':2,'KeyFrames':[{'Frame':0,'Value':0},{'Frame':8,'Value':0.6}]}]}]}]}})}
  result=convert_layout({'layout.json':json.dumps({'Anims':[animation]}).encode()},'home')
  self.assertFalse(result['warnings']);self.assertEqual(result['nativeAnimations']['DBaseNml'][0]['tracks'][0]['property'],25)
 def test_native_dialog_bounds_have_real_resource_identities(self):
  patches=[{'PaneName':name,'Size':{'X':x,'Y':y}} for name,x,y in [('N_Header',30,30),('B_Content',770,660),('L_Indicator',4,660)]]
  result=convert_layout({'common.json':json.dumps({'Files':[{'FileName':'blyt/DBaseNml.bflyt','Patches':patches}]}).encode()},'home')
  self.assertFalse(result['warnings'])
  for patch in patches:self.assertEqual(result['nativePanes']['DBaseNml'][patch['PaneName']]['Size'],patch['Size'])
  result=convert_layout({'common.json':json.dumps({'Files':[{'FileName':'blyt/DBaseNml.bflyt','Patches':[{'PaneName':'L_Mask','Size':{'X':1,'Y':1}}]}]}).encode()},'home')
  self.assertTrue(result['warnings'],'The unbound mask must retain diagnostics')
 def test_redundant_unmounted_material_assignments_are_not_converted(self):
  def material(value,file='RdtBalloon'):return {'FileName':'blyt/'+file+'.bflyt','Materials':[{'MaterialName':'W_FadeLT','BackgroundColor':value}]}
  def run(files):return convert_layout({'layout.json':json.dumps({'Files':files}).encode()},'home')
  result=run([material('FFFFFFFF')]);self.assertFalse(result['warnings']);self.assertEqual(result['converted'],0);self.assertEqual(result['ignoredAssignments'][0]['reason'],'unchanged-in-supported-bases');self.assertNotIn('_materialChanges',result)
  self.assertTrue(run([material('FF00FF00')])['warnings'],'A real window-material change still requires a renderer')
  self.assertTrue(run([material('FFFFFFFF','UnknownResource')])['warnings'],'Unknown bases cannot prove redundancy')
  result=run([material('FF00FF00'),material('FFFFFFFF')]);self.assertTrue(result['warnings']);self.assertFalse(result.get('ignoredAssignments'),'An earlier assignment invalidates the stock-value assumption')
 def test_animation_retains_preroll_and_same_frame_jumps(self):
  keys=[{'Frame':-10,'Value':0},{'Frame':8,'Value':0},{'Frame':8,'Value':240},{'Frame':140,'Value':0}]
  doc={'Anims':[{'FileName':'anim/RdtIconNewFrd_Attention.bflan','AnimJson':json.dumps({'pai1':{'FrameSize':120,'Flags':1,'Entries':[{'Name':'P_Mark_00','Tags':[{'TagType':'FLVC','Entries':[{'AnimationTarget':16,'DataType':2,'KeyFrames':keys}]}]}]}})}]}
  result=convert_layout({'layout.json':json.dumps(doc).encode()},'home');self.assertFalse(result['warnings']);track=result['nativeAnimations']['RdtIconNewFrd'][0]['tracks'][0];self.assertEqual([(k['frame'],k['value']) for k in track['keys']],[(-10,0),(8,0),(8,240),(140,0)])
 def test_status_badge_native_animation_events(self):
  animations=[]
  for file,suffix,pane,tag,prop in [('RdtIconNewFrd','Attention','P_Mark_00','FLVC',16),('IconError','Icon','N_Root','FLVI',0)]:
   animations.append({'FileName':'anim/'+file+'_'+suffix+'.bflan','AnimJson':json.dumps({'pai1':{'FrameSize':120,'Flags':1,'Entries':[{'Name':pane,'Tags':[{'TagType':tag,'Entries':[{'AnimationTarget':prop,'DataType':2,'KeyFrames':[{'Frame':0,'Value':1}]}]}]}]}})})
  result=convert_layout({'layout.json':json.dumps({'Anims':animations}).encode()},'home')
  self.assertFalse(result['warnings']);self.assertEqual(result['nativeAnimations']['RdtIconNewFrd'][0]['event'],'attention');self.assertEqual(result['nativeAnimations']['IconError'][0]['event'],'icon');self.assertEqual(result['nativeAnimations']['IconError'][0]['tracks'][0]['property'],17)
 def test_profile_digit_instance_uses_parent_material_identity(self):
  doc={'Files':[{'FileName':'blyt/RdtBtnMyPage.bflyt','Materials':[{'MaterialName':'P_GTNum_00','BackgroundColor':'FF00FF00'}]}]}
  result=convert_layout({'layout.json':json.dumps(doc).encode()},'home')
  self.assertFalse(result['warnings']);self.assertEqual(result['nativeMaterials']['RdtBtnMyPage']['P_GTNum_00']['white'],[0,255,0,255])
  self.assertNotIn('P_GTNum_00',result['nativePanes'].get('RdtBtnMyPage',{}),'A material identity is not a standalone pane')
 def test_native_shadow_functions_bind_only_real_native_passes(self):
  for value in range(6):
   doc={'Files':[{'FileName':'blyt/RdtBtnShop.bflyt','Patches':[{'PaneName':'P_PictBase','UsdPatches':[{'PropName':'S_DropShadowFunction','PropValues':[str(value)],'type':1}]}]}]}
   result=convert_layout({'layout.json':json.dumps(doc).encode()},'home')
   self.assertFalse(result['warnings']);self.assertEqual(result['nativePanes']['RdtBtnShop']['P_PictBase']['shadowFunction'],value)
  doc={'Files':[{'FileName':'blyt/Cursor3.bflyt','Patches':[{'PaneName':'P_Grow','UsdPatches':[{'PropName':'S_DropShadowFunction','PropValues':['4'],'type':1}]}]}]}
  result=convert_layout({'layout.json':json.dumps(doc).encode()},'home');self.assertFalse(result['warnings']);self.assertEqual(result['nativePanes']['Cursor3']['P_Grow']['shadowFunction'],4)
 def test_measured_native_loader_noops_remain_explicit_and_unconverted(self):
  def run(value):
   doc={'Files':[{'FileName':'blyt/BtnDialogNml.bflyt','Patches':[{'PaneName':'P_BtnBase','UsdPatches':[{'PropName':'S_DropShadowKnockout','PropValues':[str(value)],'type':1}]}]}]}
   return convert_layout({'common.json':json.dumps(doc).encode()},'home')
  for value in (0,1,2):
   result=run(value);self.assertFalse(result['warnings']);self.assertEqual(result['converted'],0)
   self.assertEqual(len(result['ignoredProperties']),1);self.assertEqual(result['ignoredProperties'][0]['value'],value)
   self.assertNotIn('shadowKnockout',result['nativePanes']['BtnDialogNml']['P_BtnBase'])
  for value in (-1,3,'future-value'):self.assertTrue(run(value)['warnings'],'Unmeasured values must retain diagnostics')
  reference=json.loads((Path(__file__).parent/'fixtures/switch/shadow-loader-reference.json').read_text())
  for profile in reference['profiles']:
   rows=profile['runs'];self.assertEqual([r['knockout'] for r in rows[:4]],[None,0,1,2])
   self.assertEqual(len({r['outputSha256'] for r in rows[:4]}),1)
   self.assertNotEqual(rows[0]['outputSha256'],rows[4]['outputSha256']);self.assertNotEqual(rows[0]['outputSha256'],rows[5]['outputSha256'])
   self.assertTrue(all(r['postCallbackCount']==0 and 'S_DropShadowKnockout' not in r['queries'] for r in rows))
   self.assertFalse(any(n for counts in profile['knockoutNameOccurrences'].values() for n in counts.values()))
 def test_nested_selection_material_has_containing_resource_identity(self):
  result=convert_layout({'common.json':json.dumps({'Files':[{'FileName':'blyt/DBtmSelBox2.bflyt','Materials':[{'MaterialName':'P_BtnLine','BackgroundColor':'FF00FF00'}]}]}).encode()},'home')
  self.assertFalse(result['warnings']);self.assertEqual(result['nativeMaterials']['DBtmSelBox2']['P_BtnLine']['white'],[0,255,0,255])
 def test_loading_resource_with_underscore_keeps_full_identity(self):
  anim={'FileName':'anim/WaiticonS_Sound_Wait.bflan','AnimJson':json.dumps({'pai1':{'FrameSize':60,'Flags':1,'Entries':[{'Name':'P_Wait','Tags':[{'TagType':'FLTS','Entries':[{'AnimationTarget':2,'Index':0,'KeyFrames':[{'Frame':0,'Value':90}]}]}]}]}})}
  result=convert_layout({'common.json':json.dumps({'Anims':[anim]}).encode()},'home')
  self.assertFalse(result['warnings']);self.assertEqual(result['nativeAnimations']['WaiticonS_Sound'][0]['event'],'wait')
  self.assertEqual(result['animations'][0]['pane'],'widget:WaiticonS_Sound:P_Wait')
 def test_loading_uv_channels_and_sampler_index(self):
  def convert(index):
   entries=[{'AnimationTarget':target,'Index':index,'DataType':2,'KeyFrames':[{'Frame':0,'Value':value}]} for target,value in enumerate([.25,.5,90,-1,0])]
   doc={'Anims':[{'FileName':'anim/Waiticon_Wait.bflan','AnimJson':json.dumps({'pai1':{'FrameSize':60,'Flags':1,'Entries':[{'Name':'P_Wait','Tags':[{'TagType':'FLTS','Entries':entries}]}]}})}]}
   return convert_layout({'common.json':json.dumps(doc).encode()},'home')
  result=convert(0);self.assertFalse(result['warnings']);self.assertEqual(result['animations'][0]['event'],'wait')
  self.assertEqual([track['property'] for track in result['animations'][0]['tracks']],[23,24,22,19,20])
  self.assertTrue(convert(1)['warnings'],'Additional texture samplers must remain unsupported until actually painted')
 def test_repeated_native_animation_entries_merge_independent_channels(self):
  def anim(entries):return {'FileName':'anim/RdtBtnIconGame_Inactive.bflan','AnimJson':json.dumps({'pai1':{'FrameSize':10,'Entries':entries}})}
  def entry(tag,target,value):return {'Name':'N_Root','Tags':[{'TagType':tag,'Entries':[{'AnimationTarget':target,'DataType':2,'KeyFrames':[{'Frame':0,'Value':value}]}]}]}
  common={'Anims':[anim([entry('FLPA',6,2),entry('FLVC',16,200)])]}
  result=convert_layout({'common.json':json.dumps(common).encode()},'home')
  self.assertEqual({t['property'] for t in result['nativeAnimations']['RdtBtnIconGame'][0]['tracks']},{6,16})
  later={'Anims':[anim([entry('FLPA',1,50),entry('FLVC',16,255)])]}
  result=convert_layout({'common.json':json.dumps(common).encode(),'layout.json':json.dumps(later).encode()},'home')
  self.assertEqual({t['property'] for t in result['nativeAnimations']['RdtBtnIconGame'][0]['tracks']},{1,16},'Replacement files must not leak channels from earlier files')
 def test_animation_file_replacement_removes_omitted_panes_and_empty_files(self):
  def anim(entries,frames=10):return {'FileName':'anim/RdtBtnIconGame_Inactive.bflan','AnimJson':json.dumps({'pai1':{'FrameSize':frames,'Entries':entries}})}
  def entry(name):return {'Name':name,'Tags':[{'TagType':'FLPA','Entries':[{'AnimationTarget':6,'DataType':2,'KeyFrames':[{'Frame':0,'Value':2}]}]}]}
  first={'Anims':[anim([entry('N_Root'),entry('N_Delete')])]}
  for replacement,expected in [(anim([entry('N_Root')]),['N_Root']),(anim([],0),[])]:
   result=convert_layout({'common.json':json.dumps(first).encode(),'layout.json':json.dumps({'Anims':[replacement]}).encode()},'home')
   self.assertEqual(result['animationFiles'],['RdtBtnIconGame_Inactive.bflan'])
   self.assertEqual([a['pane'] for a in result['nativeAnimations']['RdtBtnIconGame']],expected)
   self.assertFalse(result['warnings'])
 def test_absent_native_targets_are_explicit_noops_not_converted_operations(self):
  doc={'Files':[{'FileName':'blyt/FooterAll.bflyt','Materials':[{'MaterialName':'N_Left','BackgroundColor':'FF0000FF'}],'Patches':[{'PaneName':'MissingPane','Position':{'X':90}}]},{'FileName':'blyt/UnknownResource.bflyt','Patches':[{'PaneName':'MissingPane','Position':{'X':90}}]}]}
  result=convert_layout({'layout.json':json.dumps(doc).encode()},'home')
  self.assertEqual(result['converted'],0)
  self.assertEqual({i['kind'] for i in result['ignoredTargets']},{'pane','material'})
  self.assertTrue(any('UnknownResource' in w for w in result['warnings']),'Unknown resources cannot be inferred to be no-ops')
  self.assertFalse(any('FooterAll' in w for w in result['warnings']))
  self.assertEqual(len(result['notes']),2)
 def test_shader_colors_preserve_overbright_float_values(self):
  for kind in (1,2):
   doc={'Files':[{'FileName':'blyt/Cursor3.bflyt','Patches':[{'PaneName':'P_Main','UsdPatches':[{'PropName':'S_BorderColor0','type':kind,'PropValues':['2','2','2','255']}]}]}]}
   result=convert_layout({'layout.json':json.dumps(doc).encode()},'home')
   self.assertFalse(result['warnings']);self.assertEqual(result['effects']['cursor']['borderColor'],[510,510,510,65025])
 def test_system_applet_layout_state_animation_binds_to_dock(self):
  doc={'Anims':[{'FileName':'anim/RdtBase_SystemAppletPos.bflan','AnimJson':json.dumps({'pai1':{'FrameSize':1,'Entries':[{'Name':'L_BtnLR','Tags':[{'TagType':'FLVI','Entries':[{'AnimationTarget':0,'DataType':1,'KeyFrames':[{'Frame':0,'Value':0},{'Frame':1,'Value':1}]}]}]}]}})}]}
  result=convert_layout({'layout.json':json.dumps(doc).encode()},'home')
  self.assertFalse(result['warnings']);self.assertEqual(result['animations'][0]['pane'],'scenePane:L_BtnLR');self.assertEqual(result['animations'][0]['event'],'appletLayout');self.assertEqual(result['animations'][0]['tracks'][0]['property'],17)
 def test_native_serialization_does_not_duplicate_unsupported_diagnostics(self):
  layout={'Files':[{'FileName':'blyt/RdtBtnIconGame.bflyt','Patches':[{'PaneName':'N_Tip','UsdPatches':[{'PropName':'S_DropShadowFunction','PropValues':['9'],'type':1}]}]}]}
  result=convert_layout({'layout.json':json.dumps(layout).encode()},'home',warning_limit=None)
  self.assertEqual(len(result['warnings']),1,result['warnings'])
  self.assertIn('S_DropShadowFunction',result['warnings'][0])
  self.assertEqual(result['warningCount'],1)
 def test_known_scene_children_bind_without_theme_specific_mapping(self):
  r=convert_layout({'layout.json':json.dumps({'Files':[{'FileName':'blyt/RdtBalloon.bflyt','Patches':[{'PaneName':'N_Trans','Position':{'X':30}},{'PaneName':'N_Scissor','Scale':{'X':2,'Y':1}}]}]}).encode()},'home')
  self.assertFalse(r['warnings']);self.assertEqual(r['nativePanes']['RdtBalloon']['N_Trans']['Position']['X'],30)
  r=convert_layout({'layout.json':json.dumps({'Files':[{'FileName':'blyt/RdtBalloon.bflyt','Patches':[{'PaneName':'UnknownChild','Position':{'X':30}}]}]}).encode()},'home')
  self.assertTrue(r.get('ignoredTargets'),'Absent children must retain a visible native no-op diagnostic')
 def test_native_material_registers_keep_layout_identity(self):
  files=[{'FileName':'blyt/RdtBtnIconGame.bflyt','Materials':[{'MaterialName':'P_Blank','BackgroundColor':'FF0000FF'}]},{'FileName':'blyt/RdtBalloon.bflyt','Materials':[{'MaterialName':'P_Color','BackgroundColor':'FF00FF00'}]}]
  r=convert_layout({'layout.json':json.dumps({'Files':files}).encode()},'home')
  self.assertEqual(r['nativeMaterials']['RdtBtnIconGame']['P_Blank']['white'],[255,0,0,255])
  self.assertEqual(r['nativeMaterials']['RdtBalloon']['P_Color']['white'],[0,255,0,255])
  self.assertFalse(r['warnings'])
 def test_native_title_panes_remain_independent(self):
  files=[{'FileName':'blyt/RdtBtnIconGame.bflyt','Patches':[{'PaneName':'N_Tip','Position':{'Y':-197.875}},{'PaneName':'L_Balloon','Position':{'Y':8},'Scale':{'X':.84,'Y':.84}}]},{'FileName':'blyt/RdtBalloon.bflyt','Patches':[{'PaneName':'RootPane','Rotation':{'Z':90}},{'PaneName':'N_Size','Size':{'X':400,'Y':40}}]}]
  r=convert_layout({'layout.json':json.dumps({'Files':files}).encode()},'home')
  self.assertFalse(r['warnings'])
  native=r['nativePanes']
  self.assertEqual(native['RdtBtnIconGame']['N_Tip']['Position']['Y'],-197.875)
  self.assertEqual(native['RdtBtnIconGame']['L_Balloon']['Position']['Y'],8)
  self.assertNotIn('Scale',native['RdtBtnIconGame']['N_Tip'])
  self.assertNotIn('Size',native['RdtBalloon']['RootPane'])
  self.assertNotIn('Rotation',native['RdtBalloon']['N_Size'])
  self.assertEqual(r['effects']['gameBalloon']['Scale'],{'X':.84,'Y':.84})
 def test_native_patch_order_preserves_explicit_zero_and_palette_entries(self):
  common={'Files':[{'FileName':'blyt/RdtBtnIconGame.bflyt','Patches':[{'PaneName':'N_Tip','Position':{'Y':100},'Scale':{'X':2,'Y':2}}]}]}
  layout={'Files':[{'FileName':'blyt/RdtBtnIconGame.bflyt','Patches':[{'PaneName':'N_Tip','Position':{},'Visible':False}]}]}
  r=convert_layout({'common.json':json.dumps(common).encode(),'layout.json':json.dumps(layout).encode()},'home')
  pane=r['nativePanes']['RdtBtnIconGame']['N_Tip']
  self.assertEqual(pane['Position'],{'X':0,'Y':0,'Z':0});self.assertEqual(pane['Scale'],{'X':2,'Y':2});self.assertFalse(pane['Visible'])
 def test_icon_installation_geometry_precedes_author_layout(self):
  archive={'info.json':b'{"Version":17}', 'controller.dds':b'fixture', 'album.dds':b'fixture', 'layout.json':json.dumps({'Files':[{'FileName':'blyt/RdtBtnCtrl.bflyt','Patches':[{'PaneName':'P_Form','Size':{'X':90,'Y':70}}]}]}).encode()}
  effects=convert_layout(archive,'home')['effects']
  self.assertEqual(effects['widget:RdtBtnCtrl:P_Form']['Size'],{'X':90,'Y':70})
  self.assertFalse(effects['widget:RdtBtnCtrl:P_Stick']['Visible'])
  self.assertEqual(effects['widget:RdtBtnPvr:P_Pict_00']['Size'],{'X':64,'Y':56})
  self.assertEqual(effects['widget:RdtBtnPvr:P_Pict_00']['Position'],{'X':22,'Y':13,'Z':0})
  self.assertFalse(effects['widget:RdtBtnPvr:P_Color']['Visible'])
 def test_modern_replacement_masks_keep_authored_quad(self):
  archive={'info.json':b'{"Version":17}','card.png':b'fixture','share.png':b'fixture','nso.png':b'fixture','layout.json':json.dumps({'Files':[{'FileName':'blyt/RdtBtnVgc.bflyt','Patches':[{'PaneName':'P_Pict_00','Size':{'X':1,'Y':1},'Scale':{'X':1280,'Y':720}}]}]}).encode()}
  effects=convert_layout(archive,'home')['effects']
  self.assertEqual(effects['widget:RdtBtnVgc:P_Pict_00']['Size'],{'X':1,'Y':1})
  self.assertEqual(effects['widget:RdtBtnVgc:P_Pict_00']['Scale'],{'X':1280,'Y':720})
  self.assertFalse(effects['widget:RdtBtnSplay:N_Wave']['Visible'])
  self.assertFalse(effects['widget:RdtBtnLR:P_LR_01']['Visible'])
 def test_partial_vectors_replace_omitted_axes_with_zero(self):
  from switch_layout import pane_patch
  self.assertEqual(pane_patch({'Scale':{}})['Scale'],{'X':0,'Y':0})
  self.assertEqual(pane_patch({'Position':{'Y':252}})['Position'],{'X':0,'Y':252,'Z':0})
  self.assertEqual(pane_patch({'Scale':{'X':2}})['Scale'],{'X':2,'Y':0})
  self.assertNotIn('Scale',pane_patch({'Position':{}}))
 def test_packed_sampler_flags_and_invalid_mode(self):
  def sample(flag):
   material={"MaterialName":"P_Custm","Refs":[{"Name":"White1x1A128^s","WrapS":5,"WrapT":flag}],"Transforms":[{"ScaleX":4,"ScaleY":7}]}
   return convert_layout({"layout.json":json.dumps({"Files":[{"FileName":"blyt/BgNml.bflyt","Materials":[material]}]}).encode()},"home")
  result=sample(10)
  self.assertFalse(result['warnings'])
  texture=result['effects']['background']['texture']
  self.assertTrue(texture['mirrorY']);self.assertTrue(texture['repeatY']);self.assertEqual(texture['minFilter'],1);self.assertEqual(texture['magFilter'],0)
  self.assertTrue(sample(15)['warnings'],'Unknown clamp-border mode must remain visible')
 def test_shadow_density_and_legacy_float_storage(self):
  props=[{'PropName':'S_DropShadowVolume','PropValues':['2,8'],'type':2},{'PropName':'S_RoundRadius','PropValues':['1106247680'],'type':1}]
  result=convert_layout({'layout.json':json.dumps({'Files':[{'FileName':'blyt/Cursor3.bflyt','Patches':[{'PaneName':'P_Main','UsdPatches':props}]}]}).encode()},'home')
  self.assertFalse(result['warnings']);self.assertEqual(result['effects']['cursor']['shadowOpacity'],2.8);self.assertEqual(result['effects']['cursor']['radius'],30)
 def test_reordering_uses_native_sibling_order(self):
  file={'FileName':'blyt/RdtBase.bflyt','PullFrontPanes':['N_System','L_BtnShop'],'PushBackPanes':['N_GameRoot']}
  result=convert_layout({'layout.json':json.dumps({'Files':[file]}).encode()},'home')
  self.assertFalse(result['warnings']);order=result['paneOrder']['RdtBase.bflyt']
  self.assertLess(order['N_System'],order['N_GameRoot']);self.assertLess(order['L_BtnShop'],order['L_BtnCtrl'])
  file['PullFrontPanes']=['UnknownPane'];self.assertTrue(convert_layout({'layout.json':json.dumps({'Files':[file]}).encode()},'home')['warnings'])
 def test_expanded_real_corpus_has_complete_diagnostics(self):
  root=Path(__file__).parents[1]/'work/themezer-validation'
  if not (root/'manifest.json').exists():self.skipTest('Local third-party fixtures have not been downloaded')
  cases=json.loads((root/'manifest.json').read_text())
  fixture_cases=json.loads((Path(__file__).parent/'fixtures/switch/themezer-cases.json').read_text())
  self.assertEqual({c['id'] for c in cases},{c['id'] for c in fixture_cases})
  expected=json.loads((Path(__file__).parent/'fixtures/switch/themezer-discovery-diagnostics.json').read_text())
  for case in cases:
   with self.subTest(theme=case['id']):
    self.assertNotIn('fetchError',case)
    result=convert_layout(__import__('switch_themes')._archive(root/(case['id']+'.nxtheme')),'home',warning_limit=None)
    self.assertEqual(result['warningCount'],len(result['warnings']))
    self.assertEqual(result['warnings'],expected.get(case['id'],[]),case['id']+' diagnostics changed; review support or regressions before updating the recorded discovery findings')
 def archive(self):
  return {"layout.json":json.dumps({"Files":[{"FileName":"blyt/RdtBtnIconGame.bflyt","Patches":[{"PaneName":"P_IconGame","Size":{"X":256,"Y":384}},{"PaneName":"Unknown","Position":{"X":1}}]}],"Anims":[{"FileName":"anim/RdtBase_Enter.bflan","AnimJson":json.dumps({"pai1":{"FrameSize":120,"Flags":1,"Entries":[{"Name":"L_BgNml","Tags":[{"TagType":"FLPA","Entries":[{"AnimationTarget":5,"DataType":2,"KeyFrames":[{"Frame":0,"Value":0,"Blend":0},{"Frame":120,"Value":360,"Blend":0}]}]}]}]}})}]}).encode()}
 def test_geometry_and_animation(self):
  result=convert_layout(self.archive(),"home")
  self.assertEqual(result["panes"]["game:P_IconGame"]["Size"],{"X":256,"Y":384})
  self.assertEqual(result["animations"][0]["tracks"][0]["property"],5)
  self.assertTrue(result["animations"][0]["loop"])
  self.assertTrue(any("Unknown" in w for w in result.get("notes",[])))
 def test_grid_and_inverse_parent_scales(self):
  patches=[{"PaneName":"N_GameRoot","Scale":{"X":0.000001,"Y":1}},{"PaneName":"N_Game","Scale":{"X":1000000,"Y":1}},{"PaneName":"N_Icon_04","Position":{"X":67,"Y":-34},"Scale":{"X":0.5,"Y":0.5}}]
  result=convert_layout({"layout.json":json.dumps({"Files":[{"FileName":"blyt/RdtBase.bflyt","Patches":patches}]}).encode()},"home")
  self.assertEqual(result["panes"]["N_Icon_04"]["Position"]["Y"],-34)
  self.assertAlmostEqual(result["panes"]["N_GameRoot"]["Scale"]["X"]*result["panes"]["N_Game"]["Scale"]["X"],1)
 def test_material_endianness_and_usd(self):
  from switch_effects import color
  self.assertEqual(color("FFBCDF44"),[68,223,188,255])
  self.assertIsNone(color("FF5436e85"))
  patch={"Files":[{"FileName":"blyt/Cursor3.bflyt","Patches":[{"PaneName":"P_Main","UsdPatches":[{"PropName":"S_BorderSize","PropValues":["7"]},{"PropName":"S_RoundRadius","PropValues":["4"]},{"PropName":"S_DropShadowSize","PropValues":["10"]}]}],"Materials":[{"MaterialName":"P_Main","ForegroundColor":"0000FF00","BackgroundColor":"FF00FFFF"}]},{"FileName":"blyt/LineFooter.bflyt","Patches":[{"PaneName":"P_Line","Visible":False}]}]}
  result=convert_layout({"layout.json":json.dumps(patch).encode()},"home")
  cursor=result["effects"]["cursor"]
  self.assertEqual(cursor["white"],[255,255,0,255])
  self.assertEqual(cursor["black"],[0,255,0,0])
  self.assertEqual(cursor["borderWidth"],7)
  self.assertEqual(cursor["radius"],4)
  self.assertFalse(result["effects"]["footerLine"]["Visible"])
 def test_menu_runtime_surfaces_are_separate(self):
  files=[{"FileName":"blyt/BtnDialogNml.bflyt","Materials":[{"MaterialName":"P_BtnTouch","BackgroundColor":"FF0000FF"},{"MaterialName":"P_BtnDecideKey","BackgroundColor":"FF00FF00"}]},{"FileName":"blyt/FooterBtn.bflyt","Patches":[{"PaneName":"T_01","Visible":False}]}]
  r=convert_layout({"layout.json":json.dumps({"Files":files}).encode()},"home")
  self.assertEqual(r["effects"]["widget:BtnDialogNml:P_BtnTouch"]["white"],[255,0,0,255])
  self.assertEqual(r["effects"]["widget:BtnDialogNml:P_BtnDecideKey"]["white"],[0,255,0,255])
  self.assertFalse(r["effects"]["footer:T_01"]["Visible"])
  self.assertFalse(r["warnings"])
 def test_battery_number_binding_and_distinct_hud_symbols(self):
  anim={"pat1":{"Groups":["G_BatteryNumCustom"]},"pai1":{"FrameSize":3,"Entries":[{"Name":"N_BatteryNum","Tags":[{"TagType":"FLPA","Entries":[{"AnimationTarget":8,"DataType":2,"KeyFrames":[{"Frame":0,"Value":64},{"Frame":3,"Value":64}]}]}]}]}}
  doc={"Files":[{"FileName":"blyt/Hud.bflyt","AddGroups":[{"GroupName":"G_BatteryNumCustom","Panes":["N_BatteryNum"]}]},{"FileName":"blyt/HudTime.bflyt","Patches":[{"PaneName":"P_Colon","ColorTL":"FF0000FF"}]},{"FileName":"blyt/BatteryConsole.bflyt","Patches":[{"PaneName":"P_BatBase","Visible":False}]}],"Anims":[{"FileName":"anim/Hud_BatteryNum.bflan","AnimJson":json.dumps(anim)}]}
  r=convert_layout({"layout.json":json.dumps(doc).encode()},"home")
  self.assertEqual(r["animations"][0]["pane"],"batteryNumber")
  self.assertEqual(r["groups"]["batteryNumber"],["G_BatteryNumCustom"])
  self.assertEqual(r["effects"]["clock:P_Colon"]["corners"]["ColorTL"],[255,0,0,255])
  self.assertFalse(r["effects"]["batteryBase"]["Visible"])
  self.assertFalse(r["warnings"])
 def test_unreferenced_group_does_not_invent_animation_binding(self):
  d={"Files":[{"FileName":"blyt/RdtBtnFullLauncher.bflyt","AddGroups":[{"GroupName":"Test_EntirelyUnused_Group","Panes":["P_Pict_00"]}]}]}
  r=convert_layout({"layout.json":json.dumps(d).encode()},"home")
  self.assertFalse(r["warnings"])
  self.assertTrue(any("Unreferenced animation group" in note for note in r["notes"]))
 def test_launcher_parts_do_not_merge_independent_colors(self):
  patches=[{"PaneName":"P_Pict_00","ColorTL":"FF0000FF","Size":{"X":10,"Y":38}},{"PaneName":"P_Pict_01","ColorTL":"FF00FF00"},{"PaneName":"B_Hit","Size":{"X":140,"Y":140}},{"PaneName":"N_BtnFocusKey","Size":{"X":133,"Y":133}}]
  r=convert_layout({"layout.json":json.dumps({"Files":[{"FileName":"blyt/RdtBtnFullLauncher.bflyt","Patches":patches}]}).encode()},"home")
  self.assertNotEqual(r["effects"]["widget:RdtBtnFullLauncher:P_Pict_00"]["corners"],r["effects"]["widget:RdtBtnFullLauncher:P_Pict_01"]["corners"])
  self.assertEqual(r["effects"]["widget:RdtBtnFullLauncher:N_BtnFocusKey"]["Size"]["X"],133)
  self.assertFalse(r["warnings"])
 def test_dialog_and_applet_effect_materials(self):
  files=[{"FileName":"blyt/DBaseNml.bflyt","Patches":[{"PaneName":"P_Base","ColorTL":"FFC0C0C0"}]},{"FileName":"blyt/RdtBtnPow.bflyt","Patches":[{"PaneName":"P_BtnTouch","ColorTL":"00000000"}]}]
  r=convert_layout({"layout.json":json.dumps({"Files":files}).encode()},"home")
  self.assertEqual(r["effects"]["menuPanel"]["corners"]["ColorTL"],[192,192,192,255])
  self.assertEqual(r["effects"]["widget:RdtBtnPow:P_BtnTouch"]["corners"]["ColorTL"][3],0)
  self.assertFalse(r["warnings"])
 def test_profile_and_controller_controls(self):
  patches=[{"PaneName":"N_MyPage","Size":{"X":110,"Y":544}},{"PaneName":"L_BtnChangeUser","Visible":False},{"PaneName":"L_BalloonCtrl","Position":{"X":-220,"Y":-325}}]
  r=convert_layout({"layout.json":json.dumps({"Files":[{"FileName":"blyt/RdtBase.bflyt","Patches":patches}]}).encode()},"home")
  self.assertEqual(r["panes"]["N_MyPage"]["Size"]["Y"],544)
  self.assertFalse(r["effects"]["changeUser"]["Visible"])
  self.assertEqual(r["effects"]["controllerBalloon"]["Position"]["X"],-220)
  self.assertFalse(r["warnings"])
 def test_dock_group_and_button_bounds(self):
  patches=[{"PaneName":"N_System","Size":{"X":110,"Y":80}},{"PaneName":"L_BtnSet","Size":{"X":60,"Y":60}}]
  r=convert_layout({"layout.json":json.dumps({"Files":[{"FileName":"blyt/RdtBase.bflyt","Patches":patches}]}).encode()},"home")
  self.assertEqual(r["panes"]["N_System"]["Size"],{"X":110,"Y":80})
  self.assertEqual(r["panes"]["L_BtnSet"]["Size"]["X"],60)
  self.assertFalse(r["warnings"])
 def test_game_tooltip_and_focus_layers(self):
  patches=[{"PaneName":"N_Tip","Visible":False},{"PaneName":"P_InnerCursor","UsdPatches":[{"PropName":"S_RoundRadius","PropValues":["45"]}]},{"PaneName":"P_BtnTouch","Visible":False}]
  r=convert_layout({"layout.json":json.dumps({"Files":[{"FileName":"blyt/RdtBtnIconGame.bflyt","Patches":patches}]}).encode()},"home")
  self.assertFalse(r["effects"]["gameTooltip"]["Visible"])
  self.assertEqual(r["effects"]["gameInnerCursor"]["radius"],45)
  self.assertFalse(r["effects"]["gameTouch"]["Visible"])
  self.assertFalse(r["warnings"])
 def test_border_and_shadow_controls(self):
  properties=[("S_BorderDrawMode",["0"]),("S_DropShadowDrawMode",["1"]),("S_BorderVolume",["0.5"]),("S_DropShadowColor",["1","0","0","0.5"]),("S_DropShadowAngle",["1.5"])]
  files=[{"FileName":"blyt/Cursor3.bflyt","Patches":[{"PaneName":"P_Main","UsdPatches":[{"PropName":k,"PropValues":v} for k,v in properties]}]}]
  result=convert_layout({"layout.json":json.dumps({"Files":files}).encode()},"home")
  self.assertFalse(result["effects"]["cursor"]["borderDraw"])
  self.assertEqual(result["effects"]["cursor"]["shadowColor"],[255,0,0,128])
  self.assertFalse(result["warnings"])
 def test_modern_dock_slots(self):
  patches=[{"PaneName":name,"Position":{"X":x,"Y":-15}} for name,x in [("L_BtnLR",-370),("L_BtnSplay",0),("L_BtnVgc",185)]]
  result=convert_layout({"layout.json":json.dumps({"Files":[{"FileName":"blyt/RdtBase.bflyt","Patches":patches}]}).encode()},"home")
  self.assertEqual(result["panes"]["L_BtnVgc"]["Position"]["X"],185)
  self.assertFalse(result["warnings"])
 def test_palette_controller_indices(self):
  patch={"PaneName":"P_Bg_00","UsdPatches":[{"PropName":"C_W","PropValues":["31","2","0","0"]}]}
  def convert(): return convert_layout({"layout.json":json.dumps({"Files":[{"FileName":"blyt/BgNml.bflyt","Patches":[patch]}]}).encode()},"home")
  self.assertEqual(convert()["effects"]["backgroundPanel"]["palette"]["white"],[31,2,0,0])
  self.assertFalse(convert()["warnings"])
  patch["UsdPatches"][0]["PropValues"]=["31","2","4","0"]
  self.assertEqual(convert()["effects"]["backgroundPanel"]["palette"]["white"],[31,2,4,0])
  self.assertFalse(convert()["warnings"])
  patch["UsdPatches"][0]["PropValues"]=["31","2","117","0"]
  self.assertTrue(any("Unsupported palette" in w for w in convert()["warnings"]))
 def test_applet_label_and_launcher_root_are_separate(self):
  files=[{"FileName":"blyt/RdtBtnFullLauncher.bflyt","Patches":[{"PaneName":"N_Root","Rotation":{"Z":45}},{"PaneName":"L_Balloon","Visible":False},{"PaneName":"P_Pict_00","ColorTL":"FF00FF00"}]}]
  effects=convert_layout({"layout.json":json.dumps({"Files":files}).encode()},"home")["effects"]
  self.assertEqual(effects["widget:RdtBtnFullLauncher:N_Root"]["Rotation"]["Z"],45)
  self.assertFalse(effects["widget:RdtBtnFullLauncher:L_Balloon"]["Visible"])
  self.assertNotIn("Rotation",effects["widget:RdtBtnFullLauncher:P_Pict_00"])
 def test_wallpaper_uv_and_footer_visibility(self):
  files=[{"FileName":"blyt/BgNml.bflyt","Materials":[{"MaterialName":"P_Custm","Refs":[{"Name":"White1x1A128^s","WrapS":5,"WrapT":5}],"Transforms":[{"Name":"White1x1A128^s","ScaleX":12,"ScaleY":12}]}]},{"FileName":"blyt/FooterCtrl.bflyt","Patches":[{"PaneName":"N_Root","Visible":False}]},{"FileName":"blyt/Footer.bflyt","Patches":[{"PaneName":"L_Footer","Visible":False}]}]
  result=convert_layout({"layout.json":json.dumps({"Files":files}).encode()},"home")
  self.assertEqual(result["effects"]["background"]["texture"]["scaleX"],12)
  self.assertTrue(result["effects"]["background"]["texture"]["repeatY"])
  self.assertFalse(result["effects"]["footerController"]["Visible"])
  self.assertFalse(result["effects"]["footer"]["Visible"])
  self.assertFalse(any("texture-coordinate" in w for w in result["warnings"]))
  files[0]["Materials"][0]["Transforms"][0]["Rotate"]=90
  result=convert_layout({"layout.json":json.dumps({"Files":files}).encode()},"home")
  self.assertTrue(any("texture-coordinate" in w for w in result["warnings"]))
 def test_title_background_border_is_not_text_border(self):
  patches=[{"PaneName":"N_Size","Size":{"X":400,"Y":40}},{"PaneName":"P_Color","UsdPatches":[{"PropName":"S_BorderSize","PropValues":["7"]}]},{"PaneName":"T_Main","ColorTR":"FF00FFFF"}]
  effects=convert_layout({"layout.json":json.dumps({"Files":[{"FileName":"blyt/RdtBalloon.bflyt","Patches":patches}]}).encode()},"home")["effects"]
  self.assertNotIn("borderWidth",effects["gameTitle"])
  self.assertEqual(effects["gameTitleBackground"]["borderWidth"],7)
  self.assertEqual(effects["gameTitleText"]["corners"]["ColorTR"],[255,255,0,255])
 def test_unknown_texture_remains_reported(self):
  patch={"Files":[{"FileName":"blyt/BgNml.bflyt","Materials":[{"MaterialName":"P_Custm","Refs":[{"Name":"FirmwareTexture"}],"Transforms":[{"ScaleX":12}]}]}]}
  result=convert_layout({"layout.json":json.dumps(patch).encode()},"home")
  self.assertTrue(any("texture" in w.lower() for w in result["warnings"]))
 def test_focus_button_is_not_game_image(self):
  patch={"Anims":[{"FileName":"anim/RdtBtnIconGame_FocusKey.bflan","AnimJson":json.dumps({"pai1":{"FrameSize":1,"Entries":[{"Name":"N_BtnFocusKey","Tags":[{"TagType":"FLVC","Entries":[{"AnimationTarget":16,"KeyFrames":[{"Frame":0,"Value":0}]}]}]}]}})}]}
  result=convert_layout({"layout.json":json.dumps(patch).encode()},"home")
  self.assertEqual(result["animations"][0]["pane"],"gameFocus")
  self.assertFalse(any(a["pane"]=="game" for a in result["animations"]))
 def test_child_lock_groups_and_controller_channels(self):
  track={"Index":0,"AnimationTarget":0,"DataType":2,"FLEUEntryName":"C_Id","FLEUUnknownInt":4,"KeyFrames":[{"Frame":0,"Value":1,"Blend":0},{"Frame":45,"Value":1,"Blend":0},{"Frame":45,"Value":2,"Blend":0}]}
  data={"pat1":{"Groups":["G_Custom"]},"pai1":{"FrameSize":1,"Entries":[{"Name":"P_EffectDecideKey","Tags":[{"TagType":"FLEU","Entries":[track]}]}]}}
  doc={"Files":[{"FileName":"blyt/RdtBtnChildLock.bflyt","AddGroups":[{"GroupName":"G_Custom","Panes":["P_EffectDecideKey"]}],"Patches":[{"PaneName":"P_BaseOn","ParentOriginY":2,"Size":{"X":300,"Y":1000},"UsdPatches":[{"PropName":"C_W","PropValues":["4","103","24","0"]},{"PropName":"C_Id","PropValues":["2"]}]}]}],"Anims":[{"FileName":"anim/RdtBtnChildLock_ColorOff.bflan","AnimJson":data}]}
  def convert():return convert_layout({"layout.json":json.dumps(doc).encode()},"home")
  result=convert();self.assertFalse(result["warnings"])
  self.assertEqual(result["groups"]["childLock:G_Custom"],["childLock:P_EffectDecideKey"])
  effect=result["effects"]["childLock:P_BaseOn"]
  self.assertEqual(effect["ParentOriginY"],2);self.assertEqual(effect["paletteState"],2)
  animation=result["animations"][0]
  self.assertEqual(animation["frames"],1)
  self.assertEqual(animation["tracks"][0]["property"],18)
  self.assertEqual(animation["tracks"][0]["keys"][-1]["frame"],45)
  track["FLEUEntryName"]="UnknownController"
  self.assertTrue(any("Unsupported animation channels" in w for w in convert()["warnings"]))
 def test_backing_order_is_explicit_and_unknown_order_is_reported(self):
  file={"FileName":"blyt/RdtBase.bflyt","PullFrontPanes":["L_ChildLock","N_GameRoot"]}
  def convert():return convert_layout({"layout.json":json.dumps({"Files":[file]}).encode()},"home")
  self.assertTrue(convert()["childLockBackingBehindGames"])
  self.assertFalse(convert()["warnings"])
  file["PullFrontPanes"]=["UnknownPane"]
  self.assertTrue(any("pane reordering" in w for w in convert()["warnings"]))
  file["UnknownFeature"]={"Enabled":True}
  self.assertTrue(any("UnknownFeature" in w for w in convert()["warnings"]))
 def test_malformed(self):
  for raw in (b"broken",b"[]",b'{"Files":5}',b'{"Files":[null]}'):
   self.assertIsInstance(convert_layout({"layout.json":raw},"home"),dict)
 def test_non_home_report(self):
  self.assertTrue(convert_layout(self.archive(),"set")["warnings"])
 def test_import_pack_and_paths(self):
  with tempfile.TemporaryDirectory() as temporary:
   root=Path(temporary);theme=root/"one.nxtheme"
   with zipfile.ZipFile(theme,"w") as z:
    z.writestr("info.json",json.dumps({"ThemeName":"Test","Target":"home","Version":17}))
    z.writestr("layout.json",self.archive()["layout.json"])
   pack=root/"pack.zip"
   with zipfile.ZipFile(pack,"w") as z:z.writestr("../../outside.nxtheme",theme.read_bytes())
   result=import_theme(pack,root/"skins")
   self.assertTrue(result["success"],result)
   self.assertTrue((root/"skins"/"outside.nxtheme").is_file())
   self.assertFalse((root.parent/"outside.nxtheme").exists())
   self.assertFalse(import_theme(pack,root/"skins")["success"])
 def test_invalid_pack(self):
  with tempfile.TemporaryDirectory() as temporary:
   root=Path(temporary);pack=root/"pack.zip"
   with zipfile.ZipFile(pack,"w") as z:z.writestr("bad.nxtheme",b"bad")
   self.assertFalse(import_theme(pack,root/"skins")["success"])
   self.assertFalse((root/"skins").exists())
if __name__=="__main__":unittest.main()

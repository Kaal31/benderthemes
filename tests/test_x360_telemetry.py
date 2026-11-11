import sys,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
from x360_telemetry import read_runtime
class TelemetryTests(unittest.TestCase):
 def test_real_sensor_labels_and_missing_channels(self):
  with tempfile.TemporaryDirectory() as directory:
   root=Path(directory)
   for number,name,label,value in [(0,'k10temp','Tctl','62500'),(1,'amdgpu','edge','58000'),(2,'nvme','Composite','44000')]:
    p=root/('hwmon'+str(number));p.mkdir();(p/'name').write_text(name);(p/'temp1_label').write_text(label);(p/'temp1_input').write_text(value)
   with patch('x360_telemetry.socket.socket',side_effect=OSError):r=read_runtime(root,directory)
   self.assertEqual(r['cpuC'],62.5);self.assertEqual(r['gpuC'],58);self.assertEqual(len(r['sensors']),3)
   self.assertNotIn('caseC',r);self.assertGreater(r['storageTotalBytes'],0)
 def test_unavailable_and_invalid_sensors_are_not_fabricated(self):
  with tempfile.TemporaryDirectory() as directory:
   p=Path(directory)/'hwmon0';p.mkdir();(p/'name').write_text('k10temp');(p/'temp1_label').write_text('Tctl');(p/'temp1_input').write_text('99999999')
   with patch('x360_telemetry.socket.socket',side_effect=OSError),patch('x360_telemetry.shutil.disk_usage',side_effect=OSError):r=read_runtime(directory,directory)
   self.assertNotIn('cpuC',r);self.assertNotIn('gpuC',r);self.assertNotIn('storageTotalBytes',r);self.assertEqual(r['sensors'],[])
if __name__=='__main__':unittest.main()

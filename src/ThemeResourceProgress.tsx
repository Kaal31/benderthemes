import {ThemeLoadingScreen} from './ThemeLoadingScreen';
import type {ResourceProgress} from './themeResources';
/** First-open recovery shares the default host loading screen. */
export function ThemeResourceProgress({id,progress,error,retry}:{id:string;progress?:ResourceProgress;error?:string;retry:()=>void}){
 return <div data-theme-resource-progress={id} style={{position:'absolute',inset:0}}><ThemeLoadingScreen id={id} message={error??progress?.message??'Downloading theme media…'} percent={progress?.percent??0} error={!!error}>{error&&<button onClick={retry} style={{font:'inherit',fontSize:18,padding:'12px 24px'}}>Retry download</button>}</ThemeLoadingScreen></div>;
}

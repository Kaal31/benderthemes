import React,{useState} from 'react';
import {createRoot} from 'react-dom/client';
import {PersonalMiiCreator} from '../src/themes/PersonalMii';
createRoot(document.getElementById('app')!).render(<PersonalMiiCreator onClose={()=>{location.href='nintendo-native-mii.html?theme=wiiu&plaza=1&nativeMii=1';}}/>);

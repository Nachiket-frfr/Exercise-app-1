import React from 'react';
import './index.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import './structure.js';

gsap.registerPlugin(ScrollTrigger, TextPlugin);


export default Lead;
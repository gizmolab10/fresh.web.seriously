// @ts-ignore
import './styles/app.css';
import { mount } from "svelte";
import SeriouslyApp from './lib/svelte/main/SeriouslyApp.svelte';

const app = mount(SeriouslyApp, { target: document.body });

export default app;

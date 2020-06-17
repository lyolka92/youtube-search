import '../scss/main.scss';
import {Finder} from './modules/finder';

const header = document.getElementById('header');
const searchForm = new Finder(header);

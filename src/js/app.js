import '../scss/main.scss';
import {Finder} from '../components/finder/finder';

const header = document.getElementById('header');
const searchForm = new Finder(header);

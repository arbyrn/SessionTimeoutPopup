import 'bootstrap/dist/css/bootstrap.css!';
import 'src/css/main.css!';
import $ from 'jquery';
import bootstrap from 'bootstrap';
import * as sess from './SessPopup';
import * as sessMess from './sessionTimerMsg';

var TimeBetweenChecks = 10000; //should check every 10 seconds
var BelowTimeThreshold = 89 ;  //Popup if timeremaing less than 89 min

$("#Head").text("Hello World");
//sess.initSessionMonitor();
sessMess.Init(TimeBetweenChecks, BelowTimeThreshold);
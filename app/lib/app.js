/* global document, window, XMLHttpRequest, require, */

/**
 * My three js interface lib
 * @type {Object}
 */
const lib = require( './includes/threeLibs.js' );
/**
 * jquery csv lib
 * https://github.com/evanplaice/jquery-csv
 * @type {Object}
 */
const csv = require( './includes/jqueryCSV.min.js' );
/**
 * Lodash lib
 * https://lodash.com/
 * @type {Object}
 */
const _ = require( 'lodash' );
/**
 * nouislider lib
 * http://refreshless.com/nouislider/
 * @type {Object}
 */
const slider = require( './includes/nouislider.min.js' );


/*
 ▄▄▄▄▄▄▄▄▄▄▄  ▄            ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄  ▄
▐░░░░░░░░░░░▌▐░▌          ▐░░░░░░░░░░░▌▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░▌
▐░█▀▀▀▀▀▀▀▀▀ ▐░▌          ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌
▐░▌          ▐░▌          ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌
▐░▌ ▄▄▄▄▄▄▄▄ ▐░▌          ▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░▌
▐░▌▐░░░░░░░░▌▐░▌          ▐░▌       ▐░▌▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░▌
▐░▌ ▀▀▀▀▀▀█░▌▐░▌          ▐░▌       ▐░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌
▐░▌       ▐░▌▐░▌          ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌
▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄▄▄
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░▌ ▐░▌       ▐░▌▐░░░░░░░░░░░▌
 ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀   ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀
 */

/**
 * Global variable for the app.js file, will hold most necessary variables
 * @type {Object}
 */
var GLOBAL = {};
/**
 * Holds the url address of the server
 * @type {string}
 */
GLOBAL.addr = 'http://localhost:81';
/**
 * Holds boolean value response if the server is valid
 * @type {Boolean}
 */
GLOBAL.valid = false;
/**
 * holds volcano lat in degrees
 * @type {Number}
 */
GLOBAL.lat = _.noop();
/**
 * holds volcano long in degrees
 * @type {Number}
 */
GLOBAL.lon = _.noop();
/**
 * holds inspection plane degree difference
 * @type {Number}
 */
GLOBAL.degree = _.noop();
/**
 * holds the volcano fileName
 * @type {string}
 */
GLOBAL.fileName = _.noop();
/**
 * the life of an eq
 * @type {Number}
 */
GLOBAL.life = _.noop();
/**
 * holds the current usable volcanos
 * "name,lat,long,elev"
 * @type {Array}
 */
GLOBAL.volcanos = [
  'Redoubt,60.4849066,-152.7451997,2.7',
  'Spurr,61.293165494,-152.25083233,1',
  'Iliamna,60.03249,-153.08805,1',
  'Augustine,59.36306,-153.43056,1',
  'Fourpeaked,58.77056,-153.67056,1',
  'Snowy,58.33333,-154.68333,1',
  'Griggs,58.35472,-155.09306,1',
  'Katmai,58.27944,-154.95167,1',
  'Trident,58.2343,-155.1026,1',
  'Mageik,58.1946,-155.2544,1',
  'Martin,58.1692,-155.3566,1.860',
  'Ugashik-Peulik,57.7503,-156.37,4.836',
  'Ukinrek Maars,57.8338,-156.5139,91',
  'Aniakchak,56.9058,-158.209,1.341',
  'Veniaminof,56.1979,-159.3931,2.507',
  'Pavlof,55.4173,-161.8937,2.518',
  'Dutton,55.1867,-162.2744,1.473',
  'Shishaldin,54.7554,-163.9711,2.857',
  'Fisher,54.6692,-164.3524,1.112',
  'Westdahl,54.5171,-164.6476,1.560',
  'Akutan,54.13308,-165.98555,1.303',
  'Makushin,53.88707,-166.93202,1.8',
  'Okmok,53.419,-168.132,1.073',
  'Cleveland,52.8222,-169.945,1.730',
  'Korovin,52.37934,-174.1548,1.533',
  'Great Sitkin,52.0765,-176.1109,1.740',
  'Kanaga,51.9242,-177.1623,1.307',
  'Tanaga,51.884,-178.143,1.806',
  'Gareloi,51.78887,-178.79368,1.573',
  'Cerberus,51.9288,-179.5977,.8',
  'Little Sitkin,51.9531,-178.5356,1.188' ];

/**
 * Holds the csv data from the server
 * @type {Object}
 */
let store;

/*
 ▄         ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄       ▄▄  ▄
▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░▌     ▐░░▌▐░▌
▐░▌       ▐░▌ ▀▀▀▀█░█▀▀▀▀ ▐░▌░▌   ▐░▐░▌▐░▌
▐░▌       ▐░▌     ▐░▌     ▐░▌▐░▌ ▐░▌▐░▌▐░▌
▐░█▄▄▄▄▄▄▄█░▌     ▐░▌     ▐░▌ ▐░▐░▌ ▐░▌▐░▌
▐░░░░░░░░░░░▌     ▐░▌     ▐░▌  ▐░▌  ▐░▌▐░▌
▐░█▀▀▀▀▀▀▀█░▌     ▐░▌     ▐░▌   ▀   ▐░▌▐░▌
▐░▌       ▐░▌     ▐░▌     ▐░▌       ▐░▌▐░▌
▐░▌       ▐░▌     ▐░▌     ▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄▄▄
▐░▌       ▐░▌     ▐░▌     ▐░▌       ▐░▌▐░░░░░░░░░░░▌
 ▀         ▀       ▀       ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀
 */

/**
 * holds the html request
 * @type {XMLHttpRequest}
 */
let xmlH = new XMLHttpRequest();

xmlH.open( 'get', GLOBAL.addr + '/2007-9.postfix.csv', true );
xmlH.setRequestHeader( 'Content-Type', 'application/json;charset=UTF-8' );
xmlH.onreadystatechange = function onChange() {
  if ( xmlH.readyState === 4 && xmlH.status === 200 ) {
    store = csv.toObjects( xmlH.responseText );
  }
};
xmlH.send( '' );

/*
 ▄▄▄▄▄▄▄▄▄▄▄  ▄         ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄
▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
 ▀▀▀▀█░█▀▀▀▀ ▐░▌       ▐░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀▀▀
     ▐░▌     ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌          ▐░▌
     ▐░▌     ▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄
     ▐░▌     ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
     ▐░▌     ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀█░█▀▀ ▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀▀▀
     ▐░▌     ▐░▌       ▐░▌▐░▌     ▐░▌  ▐░▌          ▐░▌
     ▐░▌     ▐░▌       ▐░▌▐░▌      ▐░▌ ▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄
     ▐░▌     ▐░▌       ▐░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
      ▀       ▀         ▀  ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀
 */
lib.setArgs( { divID: 'viewThreeDom', url: 'http://localhost:81', divDataID: 'threed3' } );

/*
 ▄▄       ▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄        ▄  ▄         ▄
▐░░▌     ▐░░▌▐░░░░░░░░░░░▌▐░░▌      ▐░▌▐░▌       ▐░▌
▐░▌░▌   ▐░▐░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░▌░▌     ▐░▌▐░▌       ▐░▌
▐░▌▐░▌ ▐░▌▐░▌▐░▌          ▐░▌▐░▌    ▐░▌▐░▌       ▐░▌
▐░▌ ▐░▐░▌ ▐░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░▌ ▐░▌   ▐░▌▐░▌       ▐░▌
▐░▌  ▐░▌  ▐░▌▐░░░░░░░░░░░▌▐░▌  ▐░▌  ▐░▌▐░▌       ▐░▌
▐░▌   ▀   ▐░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░▌   ▐░▌ ▐░▌▐░▌       ▐░▌
▐░▌       ▐░▌▐░▌          ▐░▌    ▐░▌▐░▌▐░▌       ▐░▌
▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░▌     ▐░▐░▌▐░█▄▄▄▄▄▄▄█░▌
▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░▌      ▐░░▌▐░░░░░░░░░░░▌
 ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀        ▀▀  ▀▀▀▀▀▀▀▀▀▀▀
 */
_.forEach( GLOBAL.volcanos, function volcForEach( value ) {
  document.getElementById( 'options_volc' ).innerHTML = document.getElementById( 'options_volc' ).innerHTML +
    '<option value="' + _.join( _.split( value, ',' ), '_' ) + '">' + _.split( value, ',', 2 )[ 0 ] + '</option>';
} );

/*
 ▄         ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄        ▄  ▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄  ▄         ▄
▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░▌      ▐░▌▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░▌       ▐░▌
▐░▌       ▐░▌ ▀▀▀▀█░█▀▀▀▀ ▐░▌░▌     ▐░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌       ▐░▌
▐░▌       ▐░▌     ▐░▌     ▐░▌▐░▌    ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌
▐░▌   ▄   ▐░▌     ▐░▌     ▐░▌ ▐░▌   ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌   ▄   ▐░▌
▐░▌  ▐░▌  ▐░▌     ▐░▌     ▐░▌  ▐░▌  ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌  ▐░▌  ▐░▌
▐░▌ ▐░▌░▌ ▐░▌     ▐░▌     ▐░▌   ▐░▌ ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌ ▐░▌░▌ ▐░▌
▐░▌▐░▌ ▐░▌▐░▌     ▐░▌     ▐░▌    ▐░▌▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌▐░▌ ▐░▌▐░▌
▐░▌░▌   ▐░▐░▌ ▄▄▄▄█░█▄▄▄▄ ▐░▌     ▐░▐░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░▌░▌   ▐░▐░▌
▐░░▌     ▐░░▌▐░░░░░░░░░░░▌▐░▌      ▐░░▌▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░░▌     ▐░░▌
 ▀▀       ▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀        ▀▀  ▀▀▀▀▀▀▀▀▀▀   ▀▀▀▀▀▀▀▀▀▀▀  ▀▀       ▀▀
 */


/**
 * Hides the side menu screen
 */
function hideMenu() {
  document.getElementById( 'sideMenu' ).className = 'u_float_left menu u_hidden u_gone';
  document.getElementById( 'sideMenuOverlay' ).className = 'u_float_right menuBack u_hidden u_gone';
  document.getElementById( 'btn_Menu' ).innerHTML = 'Open Menu';
}

/**
 * array of btn checks, true == green, false == red
 * @type {Object}
 */
let btnCheck = { threeStart: false, threeStop: false, threeRender: false, threeCluster: false, threePlay: false };
function fixButtons() {
  let hold = document.getElementsByClassName( 'usable' );
  for ( let i = 0; i < hold.length; i++ ) {
    hold[ i ].className = 'u_float_left ' + ( btnCheck[ hold[ i ].id ] ? 'goodButton' : 'badButton' ) + ' usable';
  }
}

window.onload = function windowLoad() {
  lib.init();
  fixButtons();
  // fixContainers();
  // window.addEventListener( 'resize', fixContainers, false );

  document.getElementById( 'btn_Menu' ).onclick = function sideMenuBtn_clicked() {
    if ( document.getElementById( 'sideMenu' ).className !== 'u_float_left menu' ) {
      document.getElementById( 'sideMenu' ).className = 'u_float_left menu';
      document.getElementById( 'sideMenuOverlay' ).className = 'u_float_right menuBack';
      document.getElementById( 'btn_Menu' ).innerHTML = 'Close Menu';
    } else {
      hideMenu();
    }
  };
  document.getElementById( 'sideMenuOverlay' ).onclick = function sideMenuOverlay_clicked() {
    hideMenu();
  };

  document.getElementById( 'btn_MainMenu' ).onclick = function openMainMenu() {
    document.getElementById( 'viewThree' ).className = 'container u_hidden';
    document.getElementById( 'viewMain' ).className = 'container';
    document.getElementById( 'btn_MainMenu' ).className = 'menuBtn button-primary';
    document.getElementById( 'btn_Three' ).className = 'menuBtn';
  };
  document.getElementById( 'btn_Three' ).onclick = function openMainMenu() {
    document.getElementById( 'viewMain' ).className = 'container u_hidden u_gone';
    document.getElementById( 'viewThree' ).className = 'container';
    document.getElementById( 'btn_Three' ).className = 'menuBtn button-primary';
    document.getElementById( 'btn_MainMenu' ).className = 'menuBtn';
  };

  // Main Menu
  document.getElementById( 'btn-volc' ).onclick = function updateSettings() {
    let volcArry = _.split( document.getElementById( 'options_volc' ).value, '_' );
    GLOBAL.lat = _.toNumber( volcArry[ 1 ] );
    GLOBAL.lon = _.toNumber( volcArry[ 2 ] );
    GLOBAL.degree = _.toNumber( document.getElementById( 'options_degree' ).value );
    let cluster = _.toNumber( document.getElementById( 'options_cluster' ).value );
    GLOBAL.life = _.toInteger( document.getElementById( 'options_life' ).value );
    let skip = _.toInteger( document.getElementById( 'options_skip' ).value );


    lib.setArgs( { lat: GLOBAL.lat, lon: GLOBAL.lon, degree: GLOBAL.degree, k: cluster, life: GLOBAL.life, skip: skip } );

    let http = new XMLHttpRequest();
    let url = GLOBAL.addr + '/api/map';
    http.open( 'post', url, true );
    http.setRequestHeader( 'Content-Type', 'application/json;charset=UTF-8' );
    let params = { n: volcArry[ 0 ], d: GLOBAL.degree, minLat: (  GLOBAL.lat - GLOBAL.degree ), maxLat: (  GLOBAL.lat +
       GLOBAL.degree  ), minLong: (  GLOBAL.lon - GLOBAL.degree  ), maxLong: (  GLOBAL.lon +
       GLOBAL.degree  ) };
    http.onreadystatechange = function onReady_Function() {
      if ( http.readyState === 4 && http.status === 200 ) {
        let t = JSON.parse( http.responseText ).success.split( '_' );
        GLOBAL.fileName = t[ 0 ];

        lib.setSt( store );
        lib.setArgs( { fileName: GLOBAL.fileName } );
        btnCheck.threeStart = lib.isOperational();
        fixButtons();
      }
    };
    http.send( JSON.stringify( params ) );

    document.getElementById( 'updateInfo' ).innerHTML = 'volcano: ' + volcArry[ 0 ] + ', latitude: ' + GLOBAL.lat + ', longitude: ' + GLOBAL.lon
      + ', degree Range: ' + GLOBAL.degree + ', amount of cluster: ' + cluster + ', life of each earthquake: ' + GLOBAL.life + ', time per second: '
      + skip;
  };

  // Three controls
  document.getElementById( 'threeStart' ).onclick = function threeStart() {
    if ( _.indexOf( _.split( document.getElementById( this.id ).className, ' ' ), 'badButton' ) !== -1 ) {
      return;
    }

    lib.start();
    _.forIn( btnCheck, function btnFix( value, key ) {
      if ( key == 'threeStart' ) {
        btnCheck[ key ] = false;
      } else {
        btnCheck[ key ] = true;
      }
    } );
    fixButtons();
  };
  document.getElementById( 'threeStop' ).onclick = function threeStop() {
    if ( _.indexOf( _.split( document.getElementById( this.id ).className, ' ' ), 'badButton' ) !== -1 ) {
      return;
    }

    lib.stop();
    _.forIn( btnCheck, function btnFix( value, key ) {
      if ( key == 'threeStart' ) {
        btnCheck[ key ] = true;
      } else {
        btnCheck[ key ] = false;
      }
    } );
    fixButtons();
  };
  document.getElementById( 'threeRender' ).onclick = function threeStop() {
    if ( _.indexOf( _.split( document.getElementById( this.id ).className, ' ' ), 'badButton' ) !== -1 ) {
      return;
    }

    lib.renderEQ( { check: 'lol' } );
  };
  document.getElementById( 'threeCluster' ).onclick = function threeCluster() {
    if ( _.indexOf( _.split( document.getElementById( this.id ).className, ' ' ), 'badButton' ) !== -1 ) {
      return;
    }

    lib.cluster();
  };
  document.getElementById( 'threePlay' ).onclick = function threeStop() {
    if ( _.indexOf( _.split( document.getElementById( this.id ).className, ' ' ), 'badButton' ) !== -1 ) {
      return;
    }

    if ( btnCheck.threeRender ) {
      lib.toggleRun();
      _.forIn( btnCheck, function btnFix( value, key ) {
        if ( key == 'threePlay' ) {
          btnCheck[ key ] = true;
        } else {
          btnCheck[ key ] = false;
        }
      } );
    } else {
      lib.toggleRun();
      _.forIn( btnCheck, function btnFix( value, key ) {
        if ( key == 'threeStart' ) {
          btnCheck[ key ] = false;
        } else {
          btnCheck[ key ] = true;
        }
      } );
    }
    fixButtons();
  };

  // slider
  let sDate = new Date( '2007-01-01T00:00:00.000Z' );
  let eDate = new Date( '2010-01-01T00:00:00.000Z' );

  let obj = slider.create( document.getElementById( 'slider' ), {
    range: { min: [ sDate.getTime() ], max: [ eDate.getTime() ] },
    start: [ sDate.getTime(), sDate.getTime() ],
    connect: true
  } );
  obj.on( 'slide', function setValue( values, handle ) {
    if ( handle == 0 ) {
      obj.set( [ values[ handle ], values[ handle ] + GLOBAL.life ] );

      lib.setTime( { current: Math.floor( values[ handle ] + GLOBAL.life ) } );
      return;
    }

    lib.setTime( { current: Math.floor( values[ handle ] ) } );
    document.getElementById( 'slider_container_start' ).value = new Date( Math.floor( values[ handle ] ) );

    let clamp = _.clamp( values[ handle ] - GLOBAL.life, sDate.getTime(), values[ handle ] );
    document.getElementById( 'slider_container_end' ).value = new Date( Math.floor( clamp ) );
    obj.set( [ clamp ] );
  } );
  obj.on( 'set', function setValueSet( values, handle ) {
    if ( handle == 0 ) {
      document.getElementById( 'slider_container_start' ).value = new Date( Math.floor( values[ handle ] + GLOBAL.life ) );
      document.getElementById( 'slider_container_end' ).value = new Date( Math.floor( values[ handle ] ) );
    } else {
      document.getElementById( 'slider_container_start' ).value = new Date( Math.floor( values[ handle ] ) );
      document.getElementById( 'slider_container_end' ).value = new Date( Math.floor( values[ handle ] - GLOBAL.life ) );

    }
  } );
  document.getElementById( 'slider_container_start' ).addEventListener( 'change', function sliderUpdated() {
    let d = new Date( this.value );
    obj.set( [ _.clamp( d.getTime() - GLOBAL.life, sDate.getTime(), d.getTime() ), d.getTime() ] );
    document.getElementById( 'slider_container_end' ).value = new Date( Math.floor(
      _.clamp( d.getTime() - GLOBAL.life, sDate.getTime(), d.getTime() ) ) );
    lib.setTime( { current: Math.floor( d.getTime() ) } );
  } );
  lib.setArgs( { sliderSet: obj.set } );

  //
  //
  // // Document events
  // document.getElementById( 'menu-btn' ).onclick = function menuBtn_Clicked() {
  //   if ( currentVisible === 'menu' ) {
  //     return;
  //   }
  //   document.getElementById( currentVisible ).className = 'u-pull-left bodyPane u-hide';
  //   document.getElementById( currentVisible + '-btn' ).className = 'u-max-full-width';
  //   currentVisible = 'menu';
  //   document.getElementById( currentVisible ).className = 'u-pull-left bodyPane';
  //   document.getElementById( currentVisible + '-btn' ).className = 'u-max-full-width button-primary';
  //
  //   lib.stop();
  // };
  // document.getElementById( 'view-btn' ).onclick = function viewBtn_Clicked() {
  //   if ( currentVisible === 'view' ) {
  //     return;
  //   }
  //   document.getElementById( currentVisible ).className = 'u-pull-left bodyPane u-hide';
  //   document.getElementById( currentVisible + '-btn' ).className = 'u-max-full-width';
  //   currentVisible = 'view';
  //   document.getElementById( currentVisible ).className = 'u-pull-left bodyPane';
  //   document.getElementById( currentVisible + '-btn' ).className = 'u-max-full-width button-primary';
  //   if ( !lib.isInitialized() ) {
  //     lib.init();
  //   }
  // };
  //
  // document.getElementById( 'btn-start' ).onclick = function startBtn_Clicked() {
  //   if ( !lib.isRunning() ) {
  //     lib.start();
  //   }
  // };
  // document.getElementById( 'btn-stop' ).onclick = function stopBtn_Clicked() {
  //   if ( lib.isRunning() ) {
  //     lib.stop();
  //   }
  // };
  // document.getElementById( 'btn-render' ).onclick = function renderBtn_Clicked() {
  //   if ( !lib.isInitialized() || !lib.isRunning() ) {
  //     return;
  //   }
  //   lib.handle( undefined, 'undefined', GLOBAL.fileName );
  // };
  // document.getElementById( 'btn-step' ).onclick = function stepBtn_Clicked() {
  //   if ( !lib.isInitialized() || !lib.isRunning() ) {
  //     return;
  //   }
  //   lib.step();
  // };
  // // document.getElementById('btn-re-step').onclick = function() {
  // //   if(!lib.isInitialized() || !lib.isRunning())
  // //     return;
  // //   lib.reStep();
  // // };
  // document.getElementById( 'btn-clust' ).onclick = function clusterBtn_Clicked() {
  //   if ( !lib.isInitialized() || !lib.isRunning() ) {
  //     return;
  //   }
  //   lib.stepCluster();
  // };
  //
  // document.getElementById( 'btn-play' ).onclick = function playBtn_Clicked() {
  //   if ( !lib.isInitialized() || !lib.isRunning() ) {
  //     return;
  //   }
  //   lib.toggleRun();
  // };
  //
  // document.getElementById( 'btn-volc' ).onclick = function volcanoBtn_Clicked() {
  //   let t = document.getElementById( 'options_volc' ).value.split( '_' );
  //   let name = t[ 0 ];
  //   GLOBAL.lat = Number( t[ 1 ] );
  //   GLOBAL.lon = Number( t[ 2 ] );
  //
  //   GLOBAL.degree = Number( document.getElementById( 'options_degree' ).value );
  //   let cluster = Number( document.getElementById( 'options_cluster' ).value );
  //   // console.log(addr);
  //   lib.setArgs( { sliderSet: obj.set, life: 6.048e+8 * 2, lat: GLOBAL.lat, lon: GLOBAL.lon, degree: GLOBAL.degree,
  //     addr: GLOBAL.addr, k: cluster, skip: 86400000, divDataID: 'mainpageData' } );
  //   // 2.628e+9 => month, 6.048e+8 => week
  //   // console.log(lat + " " + long + " " + degree);
  //
  //
    // let http = new XMLHttpRequest();
    // let url = GLOBAL.addr + '/api/map';
    // http.open( 'post', url, true );
    // http.setRequestHeader( 'Content-Type', 'application/json;charset=UTF-8' );
    // let params = { n: name, d: GLOBAL.degree, minLat: ( Number( GLOBAL.lat ) - Number( GLOBAL.degree ) ), maxLat: ( Number( GLOBAL.lat ) +
    //   Number( GLOBAL.degree ) ), minLong: ( Number( GLOBAL.lon ) - Number( GLOBAL.degree ) ), maxLong: ( Number( GLOBAL.lon ) +
    //   Number( GLOBAL.degree ) ) };
    // http.onreadystatechange = function onReady_Function() {
    //   if ( http.readyState === 4 && http.status === 200 ) {
    //     let t = JSON.parse( http.responseText ).success.split( '_' );
    //     GLOBAL.fileName = t[ 0 ];
    //   }
    // };
  //   http.send( JSON.stringify( params ) );
  //   lib.setSt( store );
  // };
  //
  // document.getElementById( 'view-data' ).onclick = function dataView_Clicked() {
  //   lib.runD3();
  // };
};

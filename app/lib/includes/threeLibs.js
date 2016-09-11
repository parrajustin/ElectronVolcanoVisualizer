/* global document, window, THREE, requestAnimationFrame, Stats, require, module */

'use strict';

/**
 * d3 lib
 * https://d3js.org/
 * @type {Object}
 */
const d3 = require( './d3.min.js' );
/**
 * Lodash lib
 * https://lodash.com/
 * @type {Object}
 */
const _ = require( 'lodash' );
/**
 * Stats lib
 * https://github.com/mrdoob/stats.js/
 * @type {Object}
 */
const Stats = require( './stats.min.js' );


/*
 ▄               ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄         ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄
▐░▌             ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░▌
 ▐░▌           ▐░▌  ▀▀▀▀█░█▀▀▀▀ ▐░█▀▀▀▀▀▀▀▀▀ ▐░▌       ▐░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌
  ▐░▌         ▐░▌       ▐░▌     ▐░▌          ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌
   ▐░▌       ▐░▌        ▐░▌     ▐░█▄▄▄▄▄▄▄▄▄ ▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄█░▌▐░▌
    ▐░▌     ▐░▌         ▐░▌     ▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░▌
     ▐░▌   ▐░▌          ▐░▌      ▀▀▀▀▀▀▀▀▀█░▌▐░▌       ▐░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌
      ▐░▌ ▐░▌           ▐░▌               ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌
       ▐░▐░▌        ▄▄▄▄█░█▄▄▄▄  ▄▄▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄▄▄
        ▐░▌        ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌
         ▀          ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀
 */
/**
 * Visual Variables Object
 * @type {Object}
 */
var VISUAL = {};
/**
 * the Three js scene
 * @type {Object}
 */
VISUAL.scene = _.noop();
/**
 * the three js camera
 * @type {Object}
 */
VISUAL.camera = _.noop();
/**
 * the three js renderer
 * @type {Object}
 */
VISUAL.renderer = _.noop();
/**
 * the mesh of the volcano land
 * @type {object}
 */
VISUAL.planeMesh = _.noop();
/**
 * Stats library object
 * @type {Object}
 */
VISUAL.stats = _.noop();
/**
 * Check if three js is currenly running
 * @type {Boolean}
 */
VISUAL.ENABLED = false;
/**
 * check if three js has been successfully initialized
 * @type {Boolean}
 */
VISUAL.INITIALIZED = false;
/**
 * check if all args have been set
 * @type {Boolean}
 */
VISUAL.ARGS_INITIALIZED = false;
/**
 * Check if the handle renderer is currently running
 * @type {Boolean}
 */
VISUAL.DOINGWORK = false;
/**
 * Cehck if three js is running the play function
 * @type {Boolean}
 */
VISUAL.RUNNING = false;
/**
 * check if the renderer functin is currently running
 * @type {Boolean}
 */
VISUAL.RUNNINGRENDER = false;
/**
 * index location of the last rendered earthquake
 * @type {Number}
 */
VISUAL.lastRendredIndex = 0;

/*
 ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
▐░█▀▀▀▀▀▀▀▀▀  ▀▀▀▀█░█▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀▀▀
▐░▌               ▐░▌     ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░▌          ▐░▌
▐░█▄▄▄▄▄▄▄▄▄      ▐░▌     ▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░▌ ▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄
▐░░░░░░░░░░░▌     ▐░▌     ▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌▐░░░░░░░░▌▐░░░░░░░░░░░▌
 ▀▀▀▀▀▀▀▀▀█░▌     ▐░▌     ▐░▌       ▐░▌▐░█▀▀▀▀█░█▀▀ ▐░█▀▀▀▀▀▀▀█░▌▐░▌ ▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀
          ▐░▌     ▐░▌     ▐░▌       ▐░▌▐░▌     ▐░▌  ▐░▌       ▐░▌▐░▌       ▐░▌▐░▌
 ▄▄▄▄▄▄▄▄▄█░▌     ▐░▌     ▐░█▄▄▄▄▄▄▄█░▌▐░▌      ▐░▌ ▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄▄▄
▐░░░░░░░░░░░▌     ▐░▌     ▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
 ▀▀▀▀▀▀▀▀▀▀▀       ▀       ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀  ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀
 */
/**
 * array of currently rendered earthquakes, with oldest at the front[0]
 * @type {Array}
 */
let RENDEREDOBJECTS = [];
/**
 * array of earthquake objects
 * @type {Array}
 */
let EQSTORAGE = [];
/**
 * array of labels
 * @type {Array}
 */
let LABELHOLD = [];
/**
 * array of centers
 * @type {Array}
 */
let CENTERHOLD = [];
/**
 * array of currently rendered centers
 * @type {Array}
 */
let RENDEREDCENTERS = [];


/*
 ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀▀▀
▐░▌       ▐░▌▐░▌       ▐░▌▐░▌          ▐░▌
▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░▌ ▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌▐░░░░░░░░▌▐░░░░░░░░░░░▌
▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀█░█▀▀ ▐░▌ ▀▀▀▀▀▀█░▌ ▀▀▀▀▀▀▀▀▀█░▌
▐░▌       ▐░▌▐░▌     ▐░▌  ▐░▌       ▐░▌          ▐░▌
▐░▌       ▐░▌▐░▌      ▐░▌ ▐░█▄▄▄▄▄▄▄█░▌ ▄▄▄▄▄▄▄▄▄█░▌
▐░▌       ▐░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
 ▀         ▀  ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀
 */
/**
 * User Designated arguments
 * @type {Object}
 */
let ARGS = {
  /**
   * url of the earthquake server
   * @type {String}
   */
  url: _.noop(),
  /**
   * the id of the div to insert the three js dom contents
   * @type {String}
   */
  divID: _.noop(),
  /**
   * the id of the div to insert the d3 dom contents
   * @type {String}
   */
  divDataID: _.noop(),
  /**
   * the lat of the center location
   * @type {Number}
   */
  lat: _.noop(),
  /**
   * the lon of the center location
   * @type {Number}
   */
  lon: _.noop(),
  /**
   * the degree to search for eqs
   * @type {Number}
   */
  degree: _.noop(),
  /**
   * the number of clusters to look for
   * @type {Number}
   */
  k: _.noop(),
  /**
   * the amount of time to skip per second
   * @type {Number}
   */
  skip: _.noop(),
  /**
   * the life of an earthquake
   * @type {Number}
   */
  life: _.noop(),
  /**
   * the function to set the time slider
   * @type {function}
   */
  sliderSet: _.noop(),
  /**
   * makes sure there is an EQSTORAGE
   * @type {Object}
   */
  storage: _.noop(),
  /**
   * the name of the file on the server
   * @type {String}
   */
  fileName: _.noop()
};
const ARGS_KEYS = _.keys( ARGS );

/*
 ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄       ▄▄  ▄▄▄▄▄▄▄▄▄▄▄
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░▌     ▐░░▌▐░░░░░░░░░░░▌
 ▀▀▀▀█░█▀▀▀▀  ▀▀▀▀█░█▀▀▀▀ ▐░▌░▌   ▐░▐░▌▐░█▀▀▀▀▀▀▀▀▀
     ▐░▌          ▐░▌     ▐░▌▐░▌ ▐░▌▐░▌▐░▌
     ▐░▌          ▐░▌     ▐░▌ ▐░▐░▌ ▐░▌▐░█▄▄▄▄▄▄▄▄▄
     ▐░▌          ▐░▌     ▐░▌  ▐░▌  ▐░▌▐░░░░░░░░░░░▌
     ▐░▌          ▐░▌     ▐░▌   ▀   ▐░▌▐░█▀▀▀▀▀▀▀▀▀
     ▐░▌          ▐░▌     ▐░▌       ▐░▌▐░▌
     ▐░▌      ▄▄▄▄█░█▄▄▄▄ ▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄▄▄
     ▐░▌     ▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌
      ▀       ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀
 */
/**
 * Time object
 * @type {Object}
 */
let TIME = {};
/**
 * The end of the render time line
 * @type {Number}
 */
TIME.MIN = 0;
/**
 * the start of the render time line
 * @type {Number}
 */
TIME.CURRENT = 0;
/**
 * the current time
 * @type {Number}
 */
TIME.renderTimeSet = 0;
/**
 * the last current time
 * @type {Number}
 */
TIME.oldTimeSet = _.noop();

/*
 ▄▄▄▄▄▄▄▄▄▄▄  ▄            ▄         ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄
▐░░░░░░░░░░░▌▐░▌          ▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
▐░█▀▀▀▀▀▀▀▀▀ ▐░▌          ▐░▌       ▐░▌▐░█▀▀▀▀▀▀▀▀▀  ▀▀▀▀█░█▀▀▀▀ ▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌
▐░▌          ▐░▌          ▐░▌       ▐░▌▐░▌               ▐░▌     ▐░▌          ▐░▌       ▐░▌
▐░▌          ▐░▌          ▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄▄▄      ▐░▌     ▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌
▐░▌          ▐░▌          ▐░▌       ▐░▌▐░░░░░░░░░░░▌     ▐░▌     ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
▐░▌          ▐░▌          ▐░▌       ▐░▌ ▀▀▀▀▀▀▀▀▀█░▌     ▐░▌     ▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀█░█▀▀
▐░▌          ▐░▌          ▐░▌       ▐░▌          ▐░▌     ▐░▌     ▐░▌          ▐░▌     ▐░▌
▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌ ▄▄▄▄▄▄▄▄▄█░▌     ▐░▌     ▐░█▄▄▄▄▄▄▄▄▄ ▐░▌      ▐░▌
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌     ▐░▌     ▐░░░░░░░░░░░▌▐░▌       ▐░▌
 ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀       ▀       ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀
 */
/**
 * CLUSTER object
 * @type {Object}
 */
let CLUSTER = {};
/**
 * min lat cluster
 * @type {Number}
 */
CLUSTER.minLat = 0;
/**
 * max lat cluster
 * @type {Number}
 */
CLUSTER.maxLat = 0;
/**
 * min long cluster
 * @type {Number}
 */
CLUSTER.minLon = 0;
/**
 * max long cluster
 * @type {Number}
 */
CLUSTER.maxLon = 0;
/**
 * min depth
 * @type {Number}
 */
CLUSTER.minDep = -20000;
/**
 * max depth
 * @type {Number}
 */
CLUSTER.maxDep = 20000;
/**
 * What current step we are on
 * @type {Number}
 */
CLUSTER.stepNum = 0;
/** @type {object} Orign point of the volcano in x y z without modification */
CLUSTER.origin = _.noop();
/**
 * the Colors that identify to each cluster
 * @type {array}
 */
CLUSTER.colors = _.noop();

/**
 * earth approx width
 * @type {Number}
 */
const a = 6378137;
/**
 * Earth eccentricity
 * @type {Number}
 */
const e = 8.1819190842622e-2;




  /*
  ▄         ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄            ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄
 ▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░▌          ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
 ▐░▌       ▐░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░▌          ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀
 ▐░▌       ▐░▌▐░▌          ▐░▌          ▐░▌       ▐░▌▐░▌          ▐░▌       ▐░▌▐░▌
 ▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░▌          ▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄▄▄
 ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌          ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
 ▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░▌          ▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀█░█▀▀  ▀▀▀▀▀▀▀▀▀█░▌
 ▐░▌       ▐░▌▐░▌          ▐░▌          ▐░▌          ▐░▌          ▐░▌     ▐░▌            ▐░▌
 ▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄ ▐░▌          ▐░█▄▄▄▄▄▄▄▄▄ ▐░▌      ▐░▌  ▄▄▄▄▄▄▄▄▄█░▌
 ▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌          ▐░░░░░░░░░░░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌
  ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀            ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀
 */

/**
 * the resize function that fixes the threejs dom
 */
function onResize() {
  VISUAL.camera.aspect = document.getElementById( ARGS.divID ).clientWidth / document.getElementById( ARGS.divID ).clientHeight;
  VISUAL.camera.updateProjectionMatrix();
  VISUAL.renderer.setSize( document.getElementById( ARGS.divID ).clientWidth, document.getElementById( ARGS.divID ).clientHeight );
}
/**
 * Will find the closest earthquake element to the given ms
 * @param  {Number} mili the passed in ms to find
 * @return {Number}      the index of closest the element
 */
function binaryIndexOf( mili ) {
  if ( !_.isInteger( mili ) ) {
    mili = _.toInteger( mili );
  }

  let minIndex = 0;
  let maxIndex = EQSTORAGE.length - 1;
  let currentIndex;
  let currentElementMS;

  while ( minIndex <= maxIndex ) {
    currentIndex = ( minIndex + maxIndex ) / 2 | 0;
    currentElementMS = EQSTORAGE[ currentIndex ].ms;

    if ( mili < currentElementMS ) {
      maxIndex = currentIndex - 1;
    } else if ( mili > currentElementMS ) {
      minIndex = currentIndex + 1;
    } else {
      return currentIndex;
    }
  }
  return currentIndex;
}
/**
 * gets rid of all rendered objects
 */
function cleanObj() {
  for ( let i = 0; i < RENDEREDOBJECTS.length; i++ ) {
    let temp = RENDEREDOBJECTS[ i ];
    VISUAL.scene.remove( temp );
    temp.geometry.dispose();
  }
  RENDEREDCENTERS = [];
}
/**
 * gets rid of all rendered centers
 */
function cleanCent() {
  for ( let i = 0; i < RENDEREDCENTERS.length; i++ ) {
    let temp = RENDEREDCENTERS[ i ];
    VISUAL.scene.remove( temp );
    temp.geometry.dispose();
  }
  RENDEREDCENTERS = [];
}
/**
 * Start the three js render loop
 */
function start() {
  if ( !VISUAL.INITIALIZED || !VISUAL.ARGS_INITIALIZED ) {
    throw Error( JSON.stringify( ARGS ) );
  }
  VISUAL.ENABLED = true;
  animate();
}
/**
 * Stops the three js render loop
 */
function stop() {
  VISUAL.ENABLED = false;
}

/**
 * sets the arg to the object of the input, only accepts predefined arg variables
 * @param {Object} input arg ojbect
 */
function setArgs( input ) {
  // Checks all keys in input, if there is an ARGS[key] then ARGS[key] = input[key]
  _.forIn( input, function checkKeys( value, key ) {
    if ( _.indexOf( ARGS_KEYS, key ) !== -1 ) {
      ARGS[ key ] = value;
    }
  } );

  // _.map creates an array of values from the ARGS object, checks to see if an ARGS[key] == undefined; if it there is one then the
  // ARGS_INITIALIZED will stay false
  // OR every ARG value must be set to something
  if ( _.indexOf( _.map( ARGS_KEYS, function fixCluster( key ) {
    return ARGS[ key ];
  } ), undefined ) === -1 ) {
    VISUAL.ARGS_INITIALIZED = true;

    let tempCart = toCart( { lat: ARGS.lat, long: ARGS.lon, depth: 0 } );
    CLUSTER.origin = { x: tempCart.x, y: tempCart.z, z: tempCart.y };

    for ( let i = 0; i < EQSTORAGE.length; i++ ) {
      EQSTORAGE[ i ] = { depth: EQSTORAGE[ i ].dep, time: EQSTORAGE[ i ].time, ms: EQSTORAGE[ i ].ms, mag: EQSTORAGE[ i ].mag, x: EQSTORAGE[ i ].x / 100 - CLUSTER.origin.x / 100,
        y: EQSTORAGE[ i ].y / 100 - CLUSTER.origin.y / 100, z: EQSTORAGE[ i ].z / 100 - CLUSTER.origin.z / 100 };
    }

    console.log( CLUSTER );
  }
}

/**
 * returns the running state of the this three js object
 * @return {Boolean} [description]
 */
function isRunning() {
  return VISUAL.ENABLED;
}
/**
 * Checks to make sure both the inital function has been run and all ARGS have been set
 * @return {Boolean} [description]
 */
function isInitialized() {
  return VISUAL.INITIALIZED && VISUAL.ARGS_INITIALIZED;
}
/**
 * Will set the earthquake storage
 * @param {[type]} input [description]
 */
function setSt( input ) {
  if ( ARGS.lat === undefined || ARGS.lon === undefined || ARGS.degree === undefined ) {
    throw Error( 'DEFINE: lat, lon, and degree before attempting this function' );
  }

  CLUSTER.minLat = ARGS.lat - ARGS.degree;
  CLUSTER.maxLat = ARGS.lat + ARGS.degree;
  CLUSTER.minLon = ARGS.lon - ARGS.degree;
  CLUSTER.maxLon = ARGS.lon + ARGS.degree;

  let lat;
  let lon;
  let depth;
  let mag;
  let ms;
  let cartTemp;

  for ( let i = 0; i < input.length; i++ ) {
    lat = _.toNumber( input[ i ].lat );
    lon = _.toNumber( input[ i ].long );
    depth = Math.abs( _.toNumber( input[ i ].depth ) ) * ( _.toNumber( input[ i ].depth ) > 0 ? -1.0 : 1.0 ) * 1000;
    mag = _.toNumber( input[ i ].mag );
    ms = _.toInteger( input[ i ].ms );

    // values not set correctly
    if ( !_.inRange( depth, -20000, 20000 ) || _.isNaN( lat ) || _.isNaN( lon ) || _.isNaN( depth ) || _.isNaN( mag ) || _.isNaN( ms ) ) {
      continue;
    }

    // earthquake out of range
    if ( !_.inRange( lat, CLUSTER.minLat, CLUSTER.maxLat ) || !_.inRange( lon, CLUSTER.minLon, CLUSTER.maxLon ) ) {
      continue;
    }

    cartTemp = toCart( { lat: lat, long: lon, depth: depth } );

    EQSTORAGE.push( { dep: depth, time: input[ i ].time, x: cartTemp.x, z: cartTemp.y, y: cartTemp.z, mag: mag, ms: ms } );
  }
  // console.log( EQSTORAGE );
  setArgs( { storage: true } );
}
/**
 * returns the boolean expressin VISUAL.ARGS_INITIALIZED && VISUAL.INITIALIZED
 * @return {Boolean} VISUAL.ARGS_INITIALIZED && VISUAL.INITIALIZED
 */
function isOperational() {
  return VISUAL.ARGS_INITIALIZED && VISUAL.INITIALIZED;
}

/*
▄▄▄▄▄▄▄▄▄▄▄  ▄▄        ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄
▐░░░░░░░░░░░▌▐░░▌      ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
▀▀▀▀█░█▀▀▀▀ ▐░▌░▌     ▐░▌ ▀▀▀▀█░█▀▀▀▀  ▀▀▀▀█░█▀▀▀▀
    ▐░▌     ▐░▌▐░▌    ▐░▌     ▐░▌          ▐░▌
    ▐░▌     ▐░▌ ▐░▌   ▐░▌     ▐░▌          ▐░▌
    ▐░▌     ▐░▌  ▐░▌  ▐░▌     ▐░▌          ▐░▌
    ▐░▌     ▐░▌   ▐░▌ ▐░▌     ▐░▌          ▐░▌
    ▐░▌     ▐░▌    ▐░▌▐░▌     ▐░▌          ▐░▌
▄▄▄▄█░█▄▄▄▄ ▐░▌     ▐░▐░▌ ▄▄▄▄█░█▄▄▄▄      ▐░▌
▐░░░░░░░░░░░▌▐░▌      ▐░░▌▐░░░░░░░░░░░▌     ▐░▌
▀▀▀▀▀▀▀▀▀▀▀  ▀        ▀▀  ▀▀▀▀▀▀▀▀▀▀▀       ▀

 */
/**
 * the initialize function that begins the whole three js dom elements
 */
function init() {
  if ( _.isUndefined( ARGS.divID ) ) {
    throw Error( 'The div id hasn\'t been set, ARGS.divID' );
  }

  VISUAL.scene = new THREE.Scene();
  VISUAL.camera = new THREE.PerspectiveCamera( 75,
    document.getElementById( ARGS.divID ).clientWidth / document.getElementById( ARGS.divID ).clientHeight, 0.1, 10000000 );

  VISUAL.renderer = new THREE.WebGLRenderer( {
    antialias: true
  } );
  // renderer = new THREE.render();
  VISUAL.renderer.setSize( document.getElementById( ARGS.divID ).clientWidth, document.getElementById( ARGS.divID ).clientHeight );
  VISUAL.renderer.setClearColor( 0x000000 );
  document.getElementById( ARGS.divID ).appendChild( VISUAL.renderer.domElement );

  VISUAL.camera.position.set( 0, 1, -3 );
  VISUAL.camera.lookAt( new THREE.Vector3() );

  let controls = new THREE.OrbitControls( VISUAL.camera, VISUAL.renderer.domElement );

  VISUAL.scene.add( new THREE.AmbientLight( 0xffffff ) );

  let light = new THREE.DirectionalLight( 0xffffff, 0.35 );
  light.position.set( 1, 1, 1 ).normalize();
  VISUAL.scene.add( light );

//   let matP = new THREE.MeshBasicMaterial( {
//     wireframe: true,
//     color: 0xffffff
//   } );
//   let geomP = new THREE.PlaneGeometry( 222, 211, 5, 5 );
//   let plane = new THREE.Mesh( geomP, matP );
//   plane.position.y = 0;
//   plane.rotation.x = -Math.PI / 2;
// // planeMesh.rotation.z = Math.PI / 2;
//   VISUAL.scene.add( plane );

  VISUAL.stats = new Stats();
  // 0: fps, 1: ms, 2: mb, 3+: custom
  VISUAL.stats.showPanel( 1 );
  VISUAL.stats.domElement.style.position = 'absolute';
  VISUAL.stats.domElement.style.left = 'auto';
  VISUAL.stats.domElement.style.right = '0px';
  VISUAL.stats.domElement.style.top = '0px';
  document.getElementById( ARGS.divID ).appendChild( VISUAL.stats.dom );
  window.addEventListener( 'resize', onResize, false );
  render();

  VISUAL.INITIALIZED = true;
}


/*
 ▄▄▄▄▄▄▄▄▄▄▄  ▄            ▄         ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄
▐░░░░░░░░░░░▌▐░▌          ▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
▐░█▀▀▀▀▀▀▀▀▀ ▐░▌          ▐░▌       ▐░▌▐░█▀▀▀▀▀▀▀▀▀  ▀▀▀▀█░█▀▀▀▀ ▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌
▐░▌          ▐░▌          ▐░▌       ▐░▌▐░▌               ▐░▌     ▐░▌          ▐░▌       ▐░▌
▐░▌          ▐░▌          ▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄▄▄      ▐░▌     ▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌
▐░▌          ▐░▌          ▐░▌       ▐░▌▐░░░░░░░░░░░▌     ▐░▌     ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
▐░▌          ▐░▌          ▐░▌       ▐░▌ ▀▀▀▀▀▀▀▀▀█░▌     ▐░▌     ▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀█░█▀▀
▐░▌          ▐░▌          ▐░▌       ▐░▌          ▐░▌     ▐░▌     ▐░▌          ▐░▌     ▐░▌
▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌ ▄▄▄▄▄▄▄▄▄█░▌     ▐░▌     ▐░█▄▄▄▄▄▄▄▄▄ ▐░▌      ▐░▌
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌     ▐░▌     ▐░░░░░░░░░░░▌▐░▌       ▐░▌
 ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀       ▀       ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀

 */

/**
 * Cluster function
 * @param  {object} eq = earthquake storage
 */
function cluster( args ) {
  if ( !VISUAL.ARGS_INITIALIZED || !VISUAL.INITIALIZED ) {
    throw Error( 'All args need to be set an three js needs to be INITIALIZED' );
  }

  let EQSTORAGE_NAME = EQSTORAGE;
  if ( !_.isUndefined( args ) && !_.indexOf( _.keys( args ), 'eq' ) === -1 ) {
    EQSTORAGE_NAME = args.eq;
  }

  if ( _.isUndefined( CLUSTER.colors ) ) {
    CLUSTER.colors = _.times( ARGS.k, function randHexColors() {
      return _.floor( Math.random() * 0xffffff );
    } );
  }

  // console.log( _.isEmpty( CENTERHOLD ) );
  CENTERHOLD = ( _.isEmpty( CENTERHOLD ) ? randomCenters( ARGS.k ) : CENTERHOLD );
  // LABELHOLD is an empty array make it the length of
  // EQSTORAGE filled with 0
  // console.log( _.isEmpty( LABELHOLD ) + ' ' + !_.isUndefined( args.eq ) );
  if ( _.isEmpty( LABELHOLD ) ) {
    LABELHOLD = _.times( EQSTORAGE_NAME.length, _.constant( -1 ) );
  } else {
    computeLabels( EQSTORAGE_NAME, CENTERHOLD, LABELHOLD );
  }
  let oldLabelHold = [ -100, 100 ];

  // while LABELHOLD !== oldLabelHold
  while ( JSON.stringify( oldLabelHold ) !== JSON.stringify( LABELHOLD ) ) {
    oldLabelHold = _.cloneDeep( LABELHOLD );

    computeLabels( EQSTORAGE_NAME, CENTERHOLD, LABELHOLD );
    newCenters( LABELHOLD, CENTERHOLD, EQSTORAGE_NAME );
  }
}
 /**
  * returns an array of the new centers
  * @param  {array} labels  the array of labels for which each peice of data is closest to
  * @param  {array} centers the array of actual centers
  * @param  {array} data    the point ojbect array of the earthquakes
  */
function newCenters( labels, centers, data ) {
  let x = _.times( centers.length, _.constant( 0 ) );
  let y = _.times( centers.length, _.constant( 0 ) );
  let z = _.times( centers.length, _.constant( 0 ) );
  let n = _.times( centers.length, _.constant( 0 ) );

  // finding the total x y an z differences from all earthquakes that have center[label]
  _.forEach( data, function xyzSum( value, key ) {
    x[ labels[ key ] ] += value.x;
    y[ labels[ key ] ] += value.y;
    z[ labels[ key ] ] += value.z;
    n[ labels[ key ] ] += 1;
  } );

  // moving centers to their new centroid position
  _.forEach( n, function xyzAvg( value, key ) {
    centers[ key ].x = x[ key ] / value;
    centers[ key ].y = y[ key ] / value;
    centers[ key ].z = z[ key ] / value;
  } );
}

/**
 * finds the clostest center for each earthquake point
 * @param  {array} data    array of points
 * @param  {array} centers array of centers
 * @param  {array} labelArray array that contains the labels
 */
function computeLabels( data, centers, labelArray ) {
  let minDist;
  let minLabel;
  let tempDist;
  for ( let i = 0; i < data.length; i++ ) {
    minDist = _.toSafeInteger( Number.MAX_VALUE );
    minLabel = -1;

    for ( let j = 0; j < centers.length; j++ ) {
      tempDist = distance( data[ i ], centers[ j ] );
      if ( tempDist < minDist ) {
        minDist = tempDist;
        minLabel = j;
      }
    }
    labelArray[ i ] = minLabel;
  }
}

 /**
  * computes the distance between two points retrieved from http://www.movable-type.co.uk/scripts/latlong.html
  * @param  {point} point  point representation of the earthquake
  * @param  {obj} center object container of a center
  * @return {Number}        distance between the two points
  */
function distance( point, center ) {
  return Math.sqrt( ( center.x - point.x ) * ( center.x - point.x ) + ( center.y - point.y ) * ( center.y - point.y ) +
    ( center.z - point.z ) * ( center.z - point.z ) );
}

 /**
  * gives randomly spaced centers placed in the area of the eqs
  * @param  {Number} k the number of centers
  * @return {obj}   array of center objects
  */
function randomCenters( k ) {
  let center = [];

  // var p = 0;
  let tempCenter;
  for ( let i = 0; i < k; i++ ) {
    tempCenter = {};
    tempCenter.lat = _.random( CLUSTER.minLat, CLUSTER.maxLat );
    tempCenter.lon = _.random( CLUSTER.minLon, CLUSTER.maxLon );
    tempCenter.depth = _.random( CLUSTER.minDep, CLUSTER.maxDep );

    // clamp to make sure the center is in the range
    _.forEach( tempCenter, function clampValues_Safe( value, key ) {
      tempCenter[ key ] = _.clamp( value, CLUSTER[ 'min' + _.upperFirst( key ) ], CLUSTER[ 'max' + _.upperFirst( key ) ] );
    } );

    // converts the lat, lon, and depth to xyz and adds it to the center
    let cart = toCart( tempCenter );
    tempCenter.x = cart.x / 100 - CLUSTER.origin.x / 100;
    tempCenter.z = cart.y / 100 - CLUSTER.origin.z / 100;
    tempCenter.y = cart.z / 100 - CLUSTER.origin.y / 100;
    // _.forEach( toCart( tempCenter ), function convert_LLA2XYZ( value, key ) {
    //   tempCenter[ key ] = value;
    //   console.log( value );
    // } );

    center.push( tempCenter );
  }

  // console.log("done");
  return center;
}
/**
 * lat, lon, altitude to x, y, z
 * @param  {object} point object holder of the lla point
 * @return {object}       xyz point
 */
function toCart( point ) {
  let lat = point.lat * ( Math.PI / 180 );
  let lon = ( _.isUndefined( point.long ) ? point.lon : point.long ) * ( Math.PI / 180 );
  let alt = point.depth;

  let esq = e * e;
  let N = a / Math.sqrt( 1 - esq * Math.sin( lat ) * Math.sin( lat ) );
  let X = ( N + alt ) * Math.cos( lat ) * Math.cos( lon );
  let Y = ( N + alt ) * Math.cos( lat ) * Math.sin( lon );
  let Z = ( ( 1 - esq ) * N + alt ) * Math.sin( lat );

  return { x: X, y: Y, z: Z };
}

// /**
//  * [toPoint description]
//  * @param  {[type]} point [description]
//  * @return {[type]}       [description]
//  */
// function toPoint(point) {
//   var asq = a * a;
//   var esq = e * e;
//   var x = point.x;
//   var y = point.y;
//   var z = point.z;
//   var b = Math.sqrt(asq * (1 - esq));
//   var bsq = b * b;
//   var ep = Math.sqrt((asq - bsq) / bsq);
//   var p = Math.sqrt(x * x + y * y);
//   var th = Math.atan2(a * z, b * p);
//   var lon = Math.atan2(y, x);
//   var lat = Math.atan2((z + ep * ep * b * Math.pow(Math.sin(th), 3)), (p - esq * a * Math.pow(Math.cos(th), 3)));
//   // var N = a / (Math.sqrt(1 - esq * Math.sin(lat) ^ 2));
//   var g = toCart({lat: lat / (Math.PI / 180), long: lon / (Math.PI / 180), depth: 0});
//   var gm = Math.sqrt(g.x * g.x + g.y * g.y + g.z * g.z);
//   var am = Math.sqrt(x * x + y * y + z * z);
//   var alt = am - gm;
//   return {lat: lat / (Math.PI / 180), long: lon / (Math.PI / 180), depth: alt};
// }



/*
▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄
▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌
▐░█▀▀▀▀▀▀▀█░▌ ▀▀▀▀▀▀▀▀▀█░▌
▐░▌       ▐░▌          ▐░▌
▐░▌       ▐░▌ ▄▄▄▄▄▄▄▄▄█░▌
▐░▌       ▐░▌▐░░░░░░░░░░░▌
▐░▌       ▐░▌ ▀▀▀▀▀▀▀▀▀█░▌
▐░▌       ▐░▌          ▐░▌
▐░█▄▄▄▄▄▄▄█░▌ ▄▄▄▄▄▄▄▄▄█░▌
▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌
▀▀▀▀▀▀▀▀▀▀   ▀▀▀▀▀▀▀▀▀▀▀
 */

/**
 * D3 main function that handles d3 functionality
 */
function runD3() {
  let margin = {
    top: 20,
    right: 40,
    bottom: 0,
    left: 60
  };

  let width = document.getElementById( ARGS.divDataID ).clientWidth - margin.left - margin.right;
  let height = 250 - margin.top - margin.bottom;
  let depthMin = CLUSTER.minDep;
  let depthMax = 3000;
  let timeMin = ( _.isUndefined( TIME.MIN ) ? TIME.CURRENT - ARGS.life : TIME.MIN );
  let timeMax = TIME.CURRENT;

  let dataHolder = _.slice( EQSTORAGE, _.clamp( VISUAL.lastRendredIndex - ( RENDEREDOBJECTS.length - 1 ), 0, EQSTORAGE.length ), VISUAL.lastRendredIndex );
  // console.log( dataHolder );
  // console.log( EQSTORAGE );

  // setup x
  let xValue = function xValFunction( d ) {
    return d.ms;
  };
  let xScale = d3.scale.linear().range( [ 0, width ] );
  let xMap = function xMapFunction( d ) {
    return xScale( xValue( d ) );
  };
  let xAxis = d3.svg.axis().scale( xScale ).orient( 'bottom' );

  // setup y
  let yValue = function yValFunction( d ) {
    return d.depth;
  };
  let yScale = d3.scale.linear().range( [ height, 0 ] );
  let yMap = function yMapFunction( d ) {
    return yScale( yValue( d ) );
  };
  let yAxis = d3.svg.axis().scale( yScale ).orient( 'left' );

  // add the graph canvas to the body of the webpage
  // document.getElementById("mainpageData");
  document.getElementById( ARGS.divDataID ).innerHTML = '';
  let svg = d3.select( '#' + ARGS.divDataID ).append( 'svg' )
    .attr( 'width', width + margin.left + margin.right )
    .attr( 'height', height + margin.top + margin.bottom )
    .attr( 'id', 'latGraph' )
    .append( 'g' )
    .attr( 'transform', 'translate(' + margin.left + ',' + margin.top + ')' );

  xScale.domain( [ timeMin, timeMax ] );
  yScale.domain( [ depthMin, depthMax ] );

  // x-axis
  svg.append( 'g' )
    .attr( 'class', 'x axis' )
    .attr( 'transform', 'translate(0,' + height + ')' )
    .call( xAxis )
    .append( 'text' )
    .attr( 'class', 'label' )
    .attr( 'x', width )
    .attr( 'y', -6 )
    .style( 'text-anchor', 'end' )
    .text( 'time' );

  // y-axis
  svg.append( 'g' )
    .attr( 'class', 'y axis' )
    .call( yAxis )
    .append( 'text' )
    .attr( 'class', 'label' )
    .attr( 'transform', 'rotate(-90)' )
    .attr( 'y', 6 )
    .attr( 'dy', '.71em' )
    .style( 'text-anchor', 'end' )
    .text( 'depth' );

  // draw dots
  svg.selectAll( '.dot' )
    .data( dataHolder )
    .enter().append( 'circle' )
    .attr( 'class', 'dot' )
    .attr( 'r', 3.5 )
    .attr( 'cx', xMap )
    .attr( 'cy', yMap );
}


/*
 ▄         ▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄        ▄  ▄▄▄▄▄▄▄▄▄▄   ▄            ▄▄▄▄▄▄▄▄▄▄▄
▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░▌      ▐░▌▐░░░░░░░░░░▌ ▐░▌          ▐░░░░░░░░░░░▌
▐░▌       ▐░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌░▌     ▐░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌          ▐░█▀▀▀▀▀▀▀▀▀
▐░▌       ▐░▌▐░▌       ▐░▌▐░▌▐░▌    ▐░▌▐░▌       ▐░▌▐░▌          ▐░▌
▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄█░▌▐░▌ ▐░▌   ▐░▌▐░▌       ▐░▌▐░▌          ▐░█▄▄▄▄▄▄▄▄▄
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌  ▐░▌  ▐░▌▐░▌       ▐░▌▐░▌          ▐░░░░░░░░░░░▌
▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀█░▌▐░▌   ▐░▌ ▐░▌▐░▌       ▐░▌▐░▌          ▐░█▀▀▀▀▀▀▀▀▀
▐░▌       ▐░▌▐░▌       ▐░▌▐░▌    ▐░▌▐░▌▐░▌       ▐░▌▐░▌          ▐░▌
▐░▌       ▐░▌▐░▌       ▐░▌▐░▌     ▐░▐░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄▄▄
▐░▌       ▐░▌▐░▌       ▐░▌▐░▌      ▐░░▌▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
 ▀         ▀  ▀         ▀  ▀        ▀▀  ▀▀▀▀▀▀▀▀▀▀   ▀▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀▀
 */
// var holderForCluster = [];

/**
 * THIS HANDLES THE RENDERING BOTH THE PLANE AS WELL AS THE DIFFERENT EARTHQUAKES
 * @param  {array} input     input arg array; allows for time, check, and fileName
 */
function handle( input ) {
  VISUAL.DOINGWORK = true;

  let time = _.noop();
  let check = _.noop();
  let fileName = ARGS.fileName;

  if ( _.indexOf( _.keys( input ), 'time' ) !== -1 ) {
    time = input.time;
  }
  if ( _.indexOf( _.keys( input ), 'check' ) !== -1 ) {
    check = input.check;
  }
  // if ( _.indexOf( _.keys( input ), 'fileName' ) !== -1 ) {
  //   fileName = input.fileName;
  // }

  if ( _.isUndefined( VISUAL.planeMesh ) ) {
    let terrainLoader = new THREE.TerrainLoader();
    terrainLoader.load( ARGS.url + '/' + fileName + '.store.bin', function editLoadedTerrain( pass ) {
      let data = pass;

      let geometry = new THREE.PlaneGeometry( 100, 100, 399, 399 );
      let max = 0;
      for ( let i = 0; i < geometry.vertices.length; i++ ) {
        if ( data[ i ] > max ) {
          max = data[ i ];
        }
      }

      let latSkip;
      let lonSkip;
      if ( CLUSTER.minLon !== undefined && CLUSTER.minLat !== undefined ) {
        latSkip = ( CLUSTER.maxLat - CLUSTER.minLat ) / 400;
        lonSkip = ( CLUSTER.maxLon - CLUSTER.minLon ) / 400;
      }

      let xCount = 0;
      let yCount = 0;
      let hold;
      for ( let i = 0; i < geometry.vertices.length; i++ ) {
        hold = toCart( { lat: CLUSTER.minLat + latSkip * xCount, long: CLUSTER.minLon + lonSkip * yCount, depth: data[ i ] / max * 1000 + 3000 } );
        geometry.vertices[ i ].z = hold.y / 100 - CLUSTER.origin.z / 100;
        geometry.vertices[ i ].x = hold.x / 100 - CLUSTER.origin.x / 100;
        geometry.vertices[ i ].y = hold.z / 100 - CLUSTER.origin.y / 100;
        yCount += 1;
        if ( yCount >= 400 ) {
          yCount = 0;
          xCount += 1;
        }
      }

      let material = new THREE.MeshPhongMaterial( {
        map: THREE.ImageUtils.loadTexture( ARGS.url + '/' + fileName + '.store.png' )
      } );

      // material.side = THREE.BackSide;

      VISUAL.planeMesh = new THREE.Mesh( geometry, material );
      VISUAL.scene.add( VISUAL.planeMesh );
    } );
  }

  // if time variable has been defined
  if ( !_.isUndefined( time ) ) {
    let startIndex = binaryIndexOf( time );
    if ( startIndex < VISUAL.lastRendredIndex ) {
      VISUAL.lastRendredIndex = 0;
      cleanObj();
    }

    // UPDATE OBJECTS THAT ARE ALREADY RENDERED
    if ( RENDEREDOBJECTS.length !== 0 ) {
      let dTemp = EQSTORAGE[ VISUAL.lastRendredIndex - ( RENDEREDOBJECTS.length - 1 ) ].ms;

      // get rid of too old rendered objects
      while ( RENDEREDOBJECTS.length >= 1 && time - dTemp > ARGS.life ) {
        let temp = RENDEREDOBJECTS.shift();
        VISUAL.scene.remove( temp );
        temp.geometry.dispose();
        if ( RENDEREDOBJECTS.length === 0 ) {
          break;
        }
        dTemp = EQSTORAGE[ VISUAL.lastRendredIndex - ( RENDEREDOBJECTS.length - 1 ) ].ms;
      }

      // update rendered objects the new opacity level
      for ( let r = 0; r < RENDEREDOBJECTS.length; r++ ) {
        dTemp = EQSTORAGE[ VISUAL.lastRendredIndex - ( RENDEREDOBJECTS.length - 1 ) + r ].ms;
        let mag = EQSTORAGE[ VISUAL.lastRendredIndex - ( RENDEREDOBJECTS.length - 1 ) + r ].mag;

        let colorTEMHOLD = 0xff0000;
        if ( mag < 0 ) {
          colorTEMHOLD = 0x00ff00;
        } else {
          switch ( _.clamp( _.floor( mag ), 0, 5 ) ) {
          case 0:
            colorTEMHOLD = 0x0000ff;
            break;
          case 1:
            colorTEMHOLD = 0x00ffd9;
            break;
          case 2:
            colorTEMHOLD = 0xfff500;
            break;
          case 3:
            colorTEMHOLD = 0xff00e6;
            break;
          case 4:
            colorTEMHOLD = 0x00ff7d;
            break;
          case 5:
            colorTEMHOLD = 0xff7613;
            break;
          }
        }

        let material = new THREE.LineBasicMaterial( {
          color: colorTEMHOLD,
          opacity: ( 1.0 - ( time - dTemp ) / ARGS.life ),
          transparent: true,
          alphaTest: 0
        } );
        RENDEREDOBJECTS[ r ].material = material;
      }
    }

    // finding where the last rendred index holder should be
    if ( !( RENDEREDOBJECTS.length > 0 ) ) {
      let dateCheck;
      let z;
      for ( z = startIndex; z > VISUAL.lastRendredIndex; z-- ) {
        dateCheck = EQSTORAGE[ z ].ms;
        if ( Math.abs( time - dateCheck ) < ARGS.life ) {
          break;
        }
      }
      VISUAL.lastRendredIndex = z - 1;
    }

    // starting to render new earthquakes
    let geometry = new THREE.SphereGeometry( .8, 5, 5 );
    let y;
    let material;
    let tempDate;
    let mag;
    let shapeMesh;
    let colorTEMHOLD;
    for ( y = VISUAL.lastRendredIndex + 1; y <= startIndex; y++ ) {
      tempDate = EQSTORAGE[ y ].ms;
      mag = EQSTORAGE[ y ].mag;

      colorTEMHOLD = 0xff0000;
      if ( mag < 0 ) {
        colorTEMHOLD = 0x00ff00;
      } else {
        switch ( _.clamp( _.floor( mag ), 0, 5 ) ) {
        case 0:
          colorTEMHOLD = 0x0000ff;
          break;
        case 1:
          colorTEMHOLD = 0x00ffd9;
          break;
        case 2:
          colorTEMHOLD = 0xfff500;
          break;
        case 3:
          colorTEMHOLD = 0xff00e6;
          break;
        case 4:
          colorTEMHOLD = 0x00ff7d;
          break;
        case 5:
          colorTEMHOLD = 0xff7613;
          break;
        }
      }

      material = new THREE.LineBasicMaterial( {
        color: colorTEMHOLD,
        opacity: ( 1.0 - ( time - tempDate ) / ARGS.life ),
        transparent: true,
        alphaTest: 0
      } );
      shapeMesh = new THREE.Mesh( geometry, material );

      shapeMesh.position.x = EQSTORAGE[ y ].x;
      shapeMesh.position.z = EQSTORAGE[ y ].z;
      shapeMesh.position.y = EQSTORAGE[ y ].y;
      // in cartesian z is height

      RENDEREDOBJECTS.push( shapeMesh );
      VISUAL.scene.add( shapeMesh );
    }
    VISUAL.lastRendredIndex = startIndex;
    cluster( { eq: RENDEREDOBJECTS } );
  } else if ( !_.isUndefined( check ) ) {
    cleanObj();

    let geometry = new THREE.SphereGeometry( .8, 5, 5 );
    let i = 0;
    let tempColor = 0xffffff;
    let mat;
    let earthquake;
    for ( i = ( EQSTORAGE.length - 1 ); i >= 0; i-- ) {
      if ( LABELHOLD[ i ] >= 0 ) {
        tempColor = CLUSTER.colors[ LABELHOLD[ i ] ];
      }

      mat = new THREE.MeshBasicMaterial( {
        color: tempColor,
        wireframe: true
      } );
      earthquake = new THREE.Mesh( geometry, mat );

      earthquake.position.x = EQSTORAGE[ i ].x;
      earthquake.position.z = EQSTORAGE[ i ].z;
      earthquake.position.y = EQSTORAGE[ i ].y;

      VISUAL.scene.add( earthquake );
      RENDEREDOBJECTS.push( earthquake );
    }
  }

  // // rendering The CENTERS
  // let geometry = new THREE.BoxGeometry( 10, 10, 10 );
  // let material;
  // let center;
  // cleanCent();
  // for ( let y = 0; y < CENTERHOLD.length; y++ ) {
  //   material = new THREE.MeshBasicMaterial( {
  //     color: 0x4b0082
  //   } );
  //   center = new THREE.Mesh( geometry, material );
  //
  //   center.position.x = CENTERHOLD[ y ].x;
  //   center.position.z = CENTERHOLD[ y ].z;
  //   center.position.y = CENTERHOLD[ y ].y;
  //
  //   VISUAL.scene.add( center );
  //   RENDEREDCENTERS.push( center );
  // }

  VISUAL.DOINGWORK = false;
}

/**
 ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄  ▄▄        ▄  ▄▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░░▌      ▐░▌▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░▌░▌     ▐░▌▐░█▀▀▀▀▀▀▀█░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀▀▀▀█░▌
▐░▌       ▐░▌▐░▌          ▐░▌▐░▌    ▐░▌▐░▌       ▐░▌▐░▌          ▐░▌       ▐░▌
▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░▌ ▐░▌   ▐░▌▐░▌       ▐░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░█▄▄▄▄▄▄▄█░▌
▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌▐░▌  ▐░▌  ▐░▌▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░░░░░░░░░░░▌
▐░█▀▀▀▀█░█▀▀ ▐░█▀▀▀▀▀▀▀▀▀ ▐░▌   ▐░▌ ▐░▌▐░▌       ▐░▌▐░█▀▀▀▀▀▀▀▀▀ ▐░█▀▀▀▀█░█▀▀
▐░▌     ▐░▌  ▐░▌          ▐░▌    ▐░▌▐░▌▐░▌       ▐░▌▐░▌          ▐░▌     ▐░▌
▐░▌      ▐░▌ ▐░█▄▄▄▄▄▄▄▄▄ ▐░▌     ▐░▐░▌▐░█▄▄▄▄▄▄▄█░▌▐░█▄▄▄▄▄▄▄▄▄ ▐░▌      ▐░▌
▐░▌       ▐░▌▐░░░░░░░░░░░▌▐░▌      ▐░░▌▐░░░░░░░░░░▌ ▐░░░░░░░░░░░▌▐░▌       ▐░▌
 ▀         ▀  ▀▀▀▀▀▀▀▀▀▀▀  ▀        ▀▀  ▀▀▀▀▀▀▀▀▀▀   ▀▀▀▀▀▀▀▀▀▀▀  ▀         ▀ */

/**
 * the function that animates the three js dom, is a loop
 */
function animate() {
  if ( VISUAL.ENABLED ) {
    requestAnimationFrame( animate, VISUAL.renderer.domElement );

    if ( !VISUAL.RUNNINGRENDER ) {
      render();
    }
    VISUAL.stats.update();
  }
}
/**
 * sets the current time
 * @param {int} input the time in ms to set the current time to
 */
function setTime( input ) {
  if ( _.isUndefined( input ) ) {
    return;
  }

  if ( !_.isUndefined( input.current ) ) {
    TIME.CURRENT = _.floor( input.current );
  }
  if ( !_.isUndefined( input.min ) ) {
    TIME.MIN = _.floor( input.min );
  }
}
/**
 * toggles the play run in rendering
 */
function toggleRun() {
  VISUAL.RUNNING = !VISUAL.RUNNING;
}
/**
 * Will render the three js dom
 */
function render() {
  VISUAL.RUNNINGRENDER = true;
  TIME.renderTimeSet = new Date().getTime();

  if ( !VISUAL.DOINGWORK && VISUAL.RUNNING ) {
    if ( TIME.oldTimeSet === undefined ) {
      TIME.oldTimeSet = TIME.renderTimeSet;
    }
    let deltaTime = ( TIME.renderTimeSet - TIME.oldTimeSet ) / 1000;
    TIME.oldTimeSet = TIME.renderTimeSet;
    TIME.CURRENT += deltaTime * ARGS.skip;
    TIME.MIN = TIME.CURRENT - ARGS.life;
    handle( { time: TIME.CURRENT, fileName: '' } );
    ARGS.sliderSet( [ TIME.MIN, TIME.CURRENT ] );
    runD3();
    VISUAL.renderer.render( VISUAL.scene, VISUAL.camera );
  }

  if ( !VISUAL.RUNNING ) {
    VISUAL.renderer.render( VISUAL.scene, VISUAL.camera );
  }

  VISUAL.RUNNINGRENDER = false;
}



module.exports = {
  start: start,
  stop: stop,
  isInitialized: isInitialized,
  isOperational: isOperational,
  setTime: setTime,
  toggleRun: toggleRun,
  isRunning: isRunning,
  init: init,
  setSt: setSt,
  setArgs: setArgs,
  renderEQ: handle,
  cluster: cluster
};

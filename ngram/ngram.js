/**
 * ngram.js
 * Created by Joseph Michaels on 3/23/15.
 * All rights reserved.
 */

var NGram;
(function (NGram) {
    var WordOffset = (function () {
        function WordOffset(word, offset) {
            this.word = word;
            this.offset = offset;
        }
        return WordOffset;
    })();
    var Corpus = (function () {
        function Corpus(title) {
            this.title = title;
            this.models = [];
            this.createBox();
        }

        /*
         *  Corpus.createModel(n)
         *  Creates an N-Gram model of this corpus for the 
         *  specified value of n.
         */
        Corpus.prototype.createModel = function(n) {
            if (this.models[n] == undefined || this.models[n].outdated == true) {
                console.log("hello world");
                var words = this.text().split("\n");
                this.models[n] = new Model(n, words);
            }
        }

        /*
         *  Corpus.createBox()
         *  Creates the textarea for inputting the corpus data,
         *  and the surrounding div.
         */
        Corpus.prototype.createBox = function() {
            this.box = document.createElement('div');
            this.box.className = 'corpus';
            //this.box.id = this.title.replace(/\s+/g, '_').toLowerCase()+"_box";
            this.header = document.createElement('div');
            this.header.className = 'header';
            this.header.innerText = this.title;
            this.box.appendChild(this.header);
            this.box.appendChild(document.createElement('br'));
            this.textarea = document.createElement('textarea');
            this.textarea.rows = 21;
            this.textarea.cols = 20;
            this.box.appendChild(this.textarea);
        };

        /* 
         *  Corpus.text(val)
         *  Set the corpus data's textarea element to the specified
         *  value. If none in specified, returns the current data
         *  as a string.
         */
        Corpus.prototype.text = function(val) {
            if (val == undefined) {
                return this.textarea.value;
            } else {
                this.textarea.value = val;
            }
        };

        /*
         *  Corpus.select()
         *  Changes the surrounding div element to indicate this
         *  corpus has been selected. This should only be called
         *  by App, since it doesn't do anything else, such as
         *  deselecting other corpuses or setting the title box
         *  in the info panel.
         */
        Corpus.prototype.select = function() {
            this.box.className = 'corpus selected';
        }

        /*
         *  Corpus.deselect()
         *  Changes the surrounding div element to show that
         *  this corpus is deselected.
         */
        Corpus.prototype.deselect = function() {
            this.box.className = 'corpus';
        }

        return Corpus;
    })();
    var Model = (function () {
        function Model(n, corpus) {
            _this = this;
            this.outdated = false;
            this.n = n;
            this.dist = {};
            this.distOffsets = {};
            //this.seeds = {};
            this.seedOffsets = [];
            if (n >= 2) {
                //app.progressBar.max = corpus.length;
                //app.progressBar.value = 0;
                corpus.forEach(function (word) {
                    word = '^' + word + '$';
                    
                    if (word.length > n) {
                        for (var i = 0; i < word.length - n; i++) {
                            var given = word.substring(i, (i + n) - 1);
                            var letter = word[(i + n) - 1];
                            //console.log("Adding "+given+ " -> "+letter);

                            _this.dist[given] = _this.dist[given] || {};
                            _this.dist[given][letter] = _this.dist[given][letter] + 1 || 1;
                        }
                    }
                    //app.progressBar.value++;
                });
                var seedOffset = 0;
                for (var givenKey in this.dist) {
                    var offset = 0;
                    this.distOffsets[givenKey] = [];
                    for (var letterKey in this.dist[givenKey]) {
                        offset += this.dist[givenKey][letterKey];
                        // todo: change this and the seed below to use WordOffset (maybe)
                        this.distOffsets[givenKey].push([letterKey, offset]);
                    }

                    if (givenKey.indexOf('^') === 0) {
                        console.log(givenKey);
                        seedOffset += offset;
                        this.seedOffsets.push([givenKey, seedOffset]);
                    }
                }
            }
        }
        Model.prototype.randFromOffsetDist = function (offsets) {
            var maxOffset = offsets[offsets.length-1][1];
            var r = Math.floor(Math.random() * maxOffset);
            
            // linear search to find the right one according to this offset
            // a binary search would be more efficient here
            var i = 0;
            while (i < offsets.length && r >= offsets[i][1]) {
                i++;
            }
            return offsets[i][0];
        };
        Model.prototype.seedSequence = function() {
            return this.randFromOffsetDist();
        };
        Model.prototype.generate = function(maxLength) {
            var n = this.n;
            maxLength = maxLength || 10;
            
            // start with a seed
            var sequence = this.randFromOffsetDist(this.seedOffsets);
            var finish = false;
            while (sequence.length <= maxLength && !finish) {
                var given = sequence.substring((sequence.length-(n-1)), sequence.length);
                console.log(given);
                var offsets = this.distOffsets[given];
                if (offsets === undefined) {
                    finish = true;
                } else {
                    sequence += this.randFromOffsetDist(offsets);
                }
            }
            return sequence.slice(1);
        };
        return Model;
    })();
    NGram.Model = Model;
    var App = (function () {
        function App() {
            var _this = this;

            this.corpuses = [];
            this.selectedCorpus = '';
            var defaultData = {"Female names": "female_names_fin.txt", "Male names": "male_names_fin.txt"};
            this.corpusesBox = document.getElementById("corpuses");

            // Load the corpus
            var xmlhttp;
            xmlhttp = new XMLHttpRequest();

            for (var title in defaultData) {
                xmlhttp.open('GET', defaultData[title], false);
                xmlhttp.send();
                this.createCorpus(title, xmlhttp.responseText);
            }



            // Setup the other HTML elements
            this.infoPanel = document.getElementById("info_panel");
            this.corpusTitle = document.getElementById("corpus_title");
            this.progressBar = document.getElementById("progress_bar");
            this.sizeDropDown = document.getElementById("model_size");
            this.createButton = document.getElementById("create_model_button");
            this.outputDiv = document.getElementById("output_div");
            this.generateButton = document.getElementById("generate_button");
            this.femaleSelectBox = document.getElementById("female_select_box");
            this.femaleSelectButton = document.getElementById("female_select_button");
            this.maleSelectBox = document.getElementById("male_select_box");
            this.maleSelectButton = document.getElementById("male_select_button");
            this.generateMin = document.getElementById("generate_min");
            this.generateMax = document.getElementById("generate_max");
            this.count = document.getElementById("count");

            // select the first default corpus
            this.selectCorpus(Object.keys(defaultData)[0]);
            this.setupCurrentModel();

            // event handlers
            this.sizeDropDown.onchange = function (e) {
                _this.setupCurrentModel();
            }

            this.generateButton.onclick = function (e) {
                var n = parseInt(_this.sizeDropDown.value);
                var count = parseInt(_this.count.value);
                var min = parseInt(_this.generateMin.value);
                var max = parseInt(_this.generateMax.value);
                var i;
                var maxLength = max - min;
                if (maxLength >= 0) {
                    for (i = 0; i < count; i++) {
                        var name = _this.corpus().models[n].generate(min + Math.floor(Math.random() * maxLength));
                        _this.outputDiv.innerHTML += name + "<br/>";
                    }
                }
            };
        }
        App.prototype.createCorpus = function(title, text) {
            var _this = this;
            var corpus = new Corpus(title);
            corpus.text(text);
            this.corpuses[title] = corpus;
            this.corpusesBox.appendChild(corpus.box);
            corpus.header.onclick = function (e) {
                _this.selectCorpus(title);
                _this.setupCurrentModel();
                console.log("Clicked on " + title);
            };
        };
        App.prototype.selectCorpus = function(title) {
            this.selectedCorpus = title;
            // tell this corpus to show it's selected,
            // and others to show they're deselected
            this.corpuses[title].select();
            for (var name in this.corpuses) {
                if (title !== name) {
                    this.corpuses[name].deselect();
                }
            }
            // set the info panel
            this.corpusTitle.innerText = title;
        };
        App.prototype.corpus = function() {
            return this.corpuses[this.selectedCorpus];
        };
        App.prototype.setupCurrentModel = function() {
            var n = parseInt(this.sizeDropDown.value);
            console.log("Trying to create a model for "+n);
            this.corpus().createModel(n);
        };
        return App;
    })();
    NGram.App = App;
})(NGram || (NGram = {}));
var app = new NGram.App();
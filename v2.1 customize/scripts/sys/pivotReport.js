accApp.directive('pivotReport', function() {
    return {
        restrict: 'E',
        scope:{
            data:'=',
            filter:'=?',
            rows:'=?',
            cols:'=?',
            vals:'=?',
            id:'=?',
            sumFields:'=?',
            maxFields:'=?',
            textFields:'=?',
            minFields:'=?',

            averageFields:'=?'
        },
        template:'<div ng-show="_data && _data.length>0"><div id="pivot"></div></div>',
        controller:['$scope','$uibModal','$rootScope','$localStorage','excel','$filter',function($scope,$uibModal,$rootScope,$localStorage,excel,$filter){
            var tpl = $.pivotUtilities.aggregatorTemplates;
            var numberFormat = $.pivotUtilities.numberFormat;
            var intFormat = numberFormat({digitsAfterDecimal: 2});
            var _data,config;
            var setupToolbar = function(parent){
                if(!parent) return;
                if(!config.vals) config.vals =[];
                //select sum fields
                parent.append(" ");
                var span = $("<span>").appendTo(parent);
                for(var i = 0;i< $scope.sumFields.length;i++){
                    var f = $scope.sumFields[i];
                    var checked = false;
                    if(_.find(config.vals,function(v){return v==f})) checked = true;
                    var lbl = $("<label style='padding-left:10px'>").appendTo(span);
                    $("<input/>",{type:'checkbox',checked:checked,"sfield":f })
                        .appendTo(lbl)
                        .bind("change",function(){
                            var sfield = $(this).attr("sfield");
                            if(this.checked){
                                config.vals.push(sfield);
                            }else{
                                config.vals = _.filter(config.vals,function(v){
                                    return v!==sfield;
                                })

                        }

                        refresh();
                    });
                    lbl.append("<span> " + f + " </span>");

                }
            }
            //multi sum aggregator
            var multifactSumAggregator = function() {
              return function() {
                var facts = config.vals;
                if(!facts) facts =[];
                return function() {
                  var summedFacts = {};
                  for (_i = 0, _len = facts.length; _i < _len; _i++) {
                    summedFacts[facts[_i]] = 0
                  }

                  return {

                    push: function(record) {


                      for ( _i = 0, _len = facts.length; _i < _len; _i++) {
                        //summedFacts[facts[_i]] += facts[_i]?parseFloat(record[facts[_i]]):0;

                        if($scope.textFields && _.contains($scope.textFields,facts[_i]) && facts[_i] && record[facts[_i]]){
                          summedFacts[facts[_i]] = summedFacts[facts[_i]]?summedFacts[facts[_i]] + "," + record[facts[_i]]:record[facts[_i]];

                        }else{
                          summedFacts[facts[_i]] += facts[_i]?parseFloat(record[facts[_i]]):0;
                        }

                      }
                    },

                    multivalue: function() {
                      return summedFacts;
                    },

                    // return the first element for unsupported renderers.
                    value: function() { return summedFacts[facts[0]]; },
                    format: function(x) { return intFormat(x) },

                    label: "Facts"
                  };
                };
              };
            }
            //multi sum render
            var multifactTableRenderer = function(){
              return function(pivotData) {
                var toolbar,main,aggregator, c, colAttrs, colKey, colKeys, i, j, r, result, rowAttrs, rowKey, rowKeys, th, totalAggregator, tr, txt, val, x,thead,tbody,td;
                colAttrs = pivotData.colAttrs;
                rowAttrs = pivotData.rowAttrs;
                rowKeys = pivotData.getRowKeys();
                colKeys = pivotData.getColKeys();

                var hasProp = {}.hasOwnProperty;
                var spanSize = function(arr, i, j) {
                    if(!arr) return 0;
                    var l, len, n, noDraw, ref, ref1, stop, x;
                    if (i !== 0) {
                      noDraw = true;
                      for (x = l = 0, ref = j; 0 <= ref ? l <= ref : l >= ref; x = 0 <= ref ? ++l : --l) {
                        if (arr[i - 1][x] !== arr[i][x]) {
                          noDraw = false;
                        }
                      }
                      if (noDraw) {
                        return -1;
                      }
                    }
                    len = 0;
                    while (i + len < arr.length) {
                      stop = false;
                      for (x = n = 0, ref1 = j; 0 <= ref1 ? n <= ref1 : n >= ref1; x = 0 <= ref1 ? ++n : --n) {
                        if (arr[i][x] !== arr[i + len][x]) {
                          stop = true;
                        }
                      }
                      if (stop) {
                        break;
                      }
                      len++;
                    }
                    return len;
                  };

                //main
                main = $("<div>");
                var buttonExcel = $("<button>").text("Xuất excel").attr("colspan",2).bind("click",function(){
                   export();
                });
                main.append(buttonExcel);
                toolbar = $("<span>");
                main.append(toolbar);
                setupToolbar(toolbar);
                //talbe
                result = $("<table class='pvtTable'>");
                main.append(result);
                //header
                thead = $("<thead>");
                result.append(thead)
                for (j in colAttrs) {
                  c = colAttrs[j];
                  tr = $("<tr>");
                  if (parseInt(j) === 0 && rowAttrs.length !== 0) {

                    tr.append($("<th>").attr("colspan", rowAttrs.length).attr("rowspan", colAttrs.length));
                  }

                  tr.append($("<th class='pvtAxisLabel'>").text(c));


                  tmpAggregator = pivotData.getAggregator([], []);
                  if (tmpAggregator.multivalue) {
                    col_colspan = Object.keys(tmpAggregator.multivalue()).length;
                    col_rowspan = 1
                  } else {
                    col_colspan = 1
                    col_rowspan = 2
                  }

                  for (i in colKeys) {
                    colKey = colKeys[i];
                    th = $("<th class='pvtColLabel'>").text(colKey[j]).attr("colspan", col_colspan);
                    if (parseInt(j) === colAttrs.length - 1 && rowAttrs.length !== 0) {
                      th.attr("rowspan", col_rowspan);
                    }
                    tr.append(th);
                  }
                  if (parseInt(j) === 0) {
                    tr.append($("<th class='pvtTotalLabel'>").text("Tổng cộng").attr("colspan", col_colspan).attr("rowspan", col_rowspan));
                  }
                  thead.append(tr);
                }
                if (rowAttrs.length !== 0) {
                  tr = $("<tr>");
                  for (i in rowAttrs) {
                    r = rowAttrs[i];
                    tr.append($("<th class='pvtAxisLabel'>").text(r));
                  }

                  tmpAggregator = pivotData.getAggregator([], []);
                  if (tmpAggregator.multivalue) {
                    if (colAttrs.length > 0) {
                      th = $("<th>");
                      tr.append(th);
                    }

                    val = tmpAggregator.multivalue();
                    for (i in colKeys) {
                      for (v in val) {
                        tr.append($("<th class='pvtColLabel'>").text(v).data("value", v));
                      }
                    }

                    for (v in val) {
                      tr.append($("<th class='pvtColLabel'>").text(v).data("value", v));
                    }
                  } else {
                    th = $("<th>");
                    if (colAttrs.length === 0) {
                      th.addClass("pvtTotalLabel").text("Tổng cộng");
                    }
                    tr.append(th);
                  }

                  thead.append(tr);
                }
                //body
                tbody = $("<tbody>");
                result.append(tbody);

                for (i in rowKeys) {
                  rowKey = rowKeys[i];
                  tr = $("<tr>");
                  for (j in rowKey) {
                      if (!hasProp.call(rowKey, j)) continue;
                      txt = rowKey[j];
                      x = spanSize(rowKeys, parseInt(i), parseInt(j));
                      if (x !== -1) {
                        th = $("<th class='pvtRowLabel'>").text(txt).attr("rowspan", x);
                        if (parseInt(j) === rowAttrs.length - 1 && colAttrs.length !== 0) {
                          th.attr("colspan", 2);
                        }
                        tr.append(th);
                      }
                    }
                  //row datas
                  for (j in colKeys) {
                    colKey = colKeys[j];
                    aggregator = pivotData.getAggregator(rowKey, colKey);

                    if (aggregator.multivalue) {
                      val = aggregator.multivalue();
                      for (v in val) {
                        var data = val[v];
                        if(_.isNumber(data)){
                          data = aggregator.format(data);
                        }

                        tr.append($("<td class='pvtVal row" + i + " col" + j + "'>").text(data).attr("data-value", val[v]));
                      }
                    } else {
                      tmpAggregator = pivotData.getAggregator([], []);
                      if(tmpAggregator.multivalue){
                          val = tmpAggregator.multivalue();
                          for (v in val) {
                            tr.append($("<td class='pvtVal row" + i + " col" + j + "'>").text(aggregator.format(0)).attr("data-value", 0));
                          }
                      }else{
                           val = aggregator.value();
                           tr.append($("<td class='pvtVal row" + i + " col" + j + "'>").text(aggregator.format(val)).attr("data-value", val));
                      }

                    }

                  }
                  //column total
                  totalAggregator = pivotData.getAggregator(rowKey, []);


                  if (totalAggregator.multivalue) {
                    val = totalAggregator.multivalue();
                    for (v in val) {
                      var data = val[v];
                      if(_.isNumber(data)){
                        data = totalAggregator.format(data);
                      }

                      tr.append($("<td class='pvtTotal rowTotal'>").text(data).attr("data-value", val[v]).attr("data-for", "row" + i));
                    }
                  } else {
                    val = totalAggregator.value();
                    tr.append($("<td class='pvtTotal rowTotal'>").text(totalAggregator.format(val)).attr("data-value", val).attr("data-for", "row" + i));
                  }

                  tbody.append(tr);
                }
                //row total
                tr = $("<tr>");
                th = $("<th class='pvtTotalLabel'>").text("Tổng cộng");
                th.attr("colspan", rowAttrs.length + (colAttrs.length === 0 ? 0 : 1));
                tr.append(th);
                for (j in colKeys) {
                  colKey = colKeys[j];
                  totalAggregator = pivotData.getAggregator([], colKey);

                  if (totalAggregator.multivalue) {
                    val = totalAggregator.multivalue();
                    for (v in val) {
                      var data = val[v];
                      if(_.isNumber(data)){
                        data = totalAggregator.format(data);
                      }

                      tr.append($("<td class='pvtTotal colTotal'>").text(data).attr("data-value", val[v]).attr("data-for", "col" + j));
                    }
                  } else {
                    val = totalAggregator.value();
                    tr.append($("<td class='pvtTotal colTotal'>").text(totalAggregator.format(val)).attr("data-value", val).attr("data-for", "col" + j));
                  }
                }

                totalAggregator = pivotData.getAggregator([], []);

                if (totalAggregator.multivalue) {
                  val = totalAggregator.multivalue();
                  for (v in val) {
                    tr.append($("<td class='pvtGrandTotal'>").text(totalAggregator.format(val[v])).attr("data-value", val[v]));
                  }
                } else {
                  val = totalAggregator.value();
                  tr.append($("<td class='pvtGrandTotal'>").text(totalAggregator.format(val)).attr("data-value", val));
                }

                tbody.append(tr);
                result.data("dimensions", [rowKeys.length, colKeys.length]);
                return main;
              };
            };
            ///create report
            if($scope.id){
                config = $localStorage.get("pivotConfig_" + $scope.id);
                if(config){
                    config = JSON.parse(config);
                }
            }
            if(!config){
                var _rows,_cols,_vals;
                if($scope.rows){
                    _rows = $scope.rows;
                }else{
                    _rows:[]
                }
                if($scope.cols){
                    _cols = $scope.cols;
                }else{
                    _cols:[]
                }
                if($scope.vals){
                    _vals = $scope.vals;
                }else{
                    _vals:[]
                }

                config ={
                    rows: _rows,
                    cols: _cols,
                    vals:_vals
                }

            }else{
                if(!config.vals) config.vals = [];
            }
            config.cols =["Tiền","Tiền ngoại tệ"];


            config.onRefresh =  function(_config) {
                if($scope.id){
                    var config_copy = JSON.parse(JSON.stringify(_config));
                    //delete some values which are functions
                    delete config_copy["aggregators"];
                    delete config_copy["renderers"];
                    //delete some bulky default values
                    delete config_copy["rendererOptions"];
                    delete config_copy["localeStrings"];
                    delete config_copy["onRefresh"];
                    config_copy.vals = config.vals;
                    _.extend(config,config_copy);
                    //save
                    $localStorage.set("pivotConfig_" + $scope.id, JSON.stringify(config_copy));
                }
            }
            var aggregators={};
            aggregators["Cộng"] =  multifactSumAggregator();
            aggregators["Đếm"] =  function() { return tpl.count()()}
            //
            config.aggregators = aggregators;

            config.renderers = {
                "Bảng": multifactTableRenderer()
            };

            _.extend(config.renderers,$.pivotUtilities.c3_renderers);


            config.hiddenAttributes = $scope.sumFields;

            var refresh = function(){
                if(!_data) _data=[];
                 if(!config.vals) config.vals =[];
                $("#pivot").pivotUI( _data,config,true)
            }
            var export = function(){
                excel.tableToExcel(".pvtTable","ungdungquanly.vn");
            }
            $scope.$watch('data',function(n,o){
                if(n && !_.isEqual(n,o)){
                    if($scope.filter){
                        _data = _.where($scope.data,$scope.filter);
                    }else{
                        _data = $scope.data;
                    }
                    $scope._data = _data;
                    refresh();
                }
            })

        }],
        link: function(scope, element, attrs) {

        }
    };
});

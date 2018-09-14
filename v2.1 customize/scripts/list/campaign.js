
var campaignModule = new baseInput('campaign','campaign',["title"],'Chiến dịch',{
    has_view:true,
    onView:function($scope,options){
       
        var graphDefinition;
        
        var steps =[];
        var createChild = function(chs){
            if(!chs.children) return;
            
            chs.children.forEach(function(bgd){
                steps.push(bgd);
                bgd.title = bgd.title?bgd.title.split(")").join("_").split("(").join("_"):"";
                //button add
                if( bgd.title=='+'){
                    if(chs._id){
                        graphDefinition = graphDefinition +'\n' + chs._id + '---' + bgd._id + '((' + bgd.title + '))'
                    }else{
                        graphDefinition = graphDefinition +'\n' + bgd._id + '((' + bgd.title + '))'
                    }
                    
                    graphDefinition = graphDefinition +'\nclick ' + bgd._id   + ' addStep'
                    graphDefinition = graphDefinition +'\nstyle ' + bgd._id   +  ' fill:silver'
                }else{
                    if(chs._id){
                        graphDefinition = graphDefinition +'\n' + chs._id + '-->' + bgd._id + '(' + (bgd.exfields && bgd.exfields.icon?'fa:' + bgd.exfields.icon + ' ':'')  + bgd.title + ')'
                    }else{
                        graphDefinition = graphDefinition +'\n' + bgd._id + '(' + (bgd.exfields && bgd.exfields.icon?'fa:' + bgd.exfields.icon + ' ':'')  + bgd.title + ')'
                    }
                    graphDefinition = graphDefinition +'\nclick ' + bgd._id   + ' editStep'
                    graphDefinition = graphDefinition +'\nstyle ' + bgd._id   +  ' fill:white,stroke:#1AB394,stroke-width:2px'
                }
                //child
                createChild(bgd);
                
            });
            
        }
        window.editStep = function(id){
            STPModules['step'].obj.quickview(options.$uibModal,{},function(){     
             },{
                 templateUrl:'list-view',
                 onLoadView:function($_scope,$rootScope,$uibModalInstance){
                     $_scope.formShare = function(form){
                         if(!form || !form._id) return {url:'',frame:''};
                         
                          var url = server_url + "/v2/form.html#!?id=" + form._id + "&cid=" + $scope.data._id;
                          var frame = '<iframe src="' + url + '" frameborder="0" scrolling="auto" allowfullscreen style="display: block;margin-left: auto;margin-right: auto;"></iframe>'
                          return {
                              url:url,
                              frame:frame
                          }
                     }
                     
                     $_scope.selectedStep = _.find(steps,function(s){return s._id==id});
                     
                     $_scope.selectStep = function(row){
                         var step = JSON.parse(JSON.stringify(row));
                         $_scope.setSelectedRow(row);
                         $_scope.selectedStep = {p_id:$_scope.selectedStep.p_id,children:$_scope.selectedStep.children};
                         _.extend($_scope.selectedStep,row);
                         $_scope.selectedStep._id_o = $_scope.selectedStep._id ;
                         $_scope.selectedStep._id = id + $_scope.selectedStep._id + moment().format("YYYYMMDDhhmmss");;
                     }
                     
                     $_scope.ok = function(){
                         //get parent
                         var p = _.find(steps,function(s){return s._id==$_scope.selectedStep.p_id});
                         if(p){
                            //remove old
                            p.children = _.filter(p.children,function(c){
                                return c._id !=id;
                            })
                            //add new
                            p.children.push($_scope.selectedStep);
                            //save
                            options.service.update($scope.data.id_app,$scope.data._id,$scope.data).then(function(res){
                                $uibModalInstance.close();
                            },function(e){
                                console.log(e.data);
                            });
                         }else{
                             $uibModalInstance.close();
                         }
                     }
                     $_scope.remove = function(){
                         if($_scope.selectedStep){
                            var p = _.find(steps,function(s){return s._id==$_scope.selectedStep.p_id});
                            if(p && p.children){
                                p.children = _.filter(p.children,function(c){
                                    return c._id !=id;
                                })
                                
                                if(p._id!=='bg_begin'){
                                    $_scope.selectedStep.children.forEach(function(c){

                                        _.filter(steps,function(s){return s.p_id==c._id}).forEach(function(_c){
                                             _c.p_id = p._id;
                                             p.children.push(_c);
                                        })

                                    })
                                }
                                
                                
                                options.service.update($scope.data.id_app,$scope.data._id,$scope.data).then(function(res){
                                  
                                    $uibModalInstance.close();
                                },function(e){
                                    console.log(e.data);
                                });
                            }else{
                                $uibModalInstance.close();
                            }
                            
                         }else{
                             $uibModalInstance.close();
                         }
                         
                     }
                     
                 }
             })
        }
        
        window.addStep = function(id){
            STPModules['step'].obj.quickview(options.$uibModal,{},function(){     
             },{
                 templateUrl:'list-view',
                 onLoadView:function($_scope,$rootScope,$uibModalInstance){
                     $_scope.formShare = function(form){
                          var url = server_url + "/v2/form.html#!?id=" + form._id + "&cid=" + $scope.data._id;
                          var frame = '<iframe src="' + url + '" frameborder="0" scrolling="auto" allowfullscreen style="display: block;margin-left: auto;margin-right: auto;"></iframe>'
                          return {
                              url:url,
                              frame:frame
                          }
                     }
                    
                    $_scope.selectedStep;
                     $_scope.selectStep = function(row){
                         var step = JSON.parse(JSON.stringify(row));
                         $_scope.setSelectedRow(step);
                         $_scope.selectedStep = {};
                         _.extend($_scope.selectedStep,step);
                         $_scope.selectedStep.p_id = id;
                         $_scope.selectedStep._id_o = $_scope.selectedStep._id ;
                         $_scope.selectedStep._id = id + $_scope.selectedStep._id + moment().format("YYYYMMDDhhmmss");
                     }
                     
                     $_scope.ok = function(){
                        if($_scope.selectedStep){
                            var p = _.find(steps,function(s){return s._id==id});
                            var children =[];
                            if(id=='bg_begin'){
                                if(p.children && p.children.length>0){
                                    children  = JSON.parse(JSON.stringify(p.children[0].children));
                                    children.forEach(function(c){
                                        c.children =[];
                                    })

                                }else{
                                    children =[{_id:'bg_' + $_scope.selectedStep._id,title:'+',children:[]}];
                                }
                                $_scope.selectedStep.children  = children;

                                p.children.push($_scope.selectedStep);
                            }else{
                                children = p.children;
                                $_scope.selectedStep.children =[{_id:'bg_' + $_scope.selectedStep._id,title:'+',children:children}];
                                p.children=[$_scope.selectedStep];
                            }
                            
                            
                            options.service.update($scope.data.id_app,$scope.data._id,$scope.data,function(e){
                                console.log(e);
                            });
                        }
                        $uibModalInstance.close();
                     }
                     $_scope.remove = function(){
                         $uibModalInstance.close();
                     }
                     
                 }
                 
             })
        }
        var createGraph = function(){

            graphDefinition = 'graph TD';
            
            if(!$scope.data.steps){
                $scope.data.steps ={_id:'begin',title:'Bắt đầu',children:[{_id:'bg_begin',title:'+',children:[]}]}
            }
            steps =[$scope.data.steps];
            //create node begin
            graphDefinition = graphDefinition +'\n' +  $scope.data.steps._id + '(' +  $scope.data.steps.title + ')'
            graphDefinition = graphDefinition +'\nstyle ' + $scope.data.steps._id  +  ' fill:white,stroke:#34AADC,stroke-width:2px'
            
            
            createChild($scope.data.steps);
            
            var int_graphDiv = options.$interval(function(){
                //
                var mermaidholder = document.querySelector("#graphDiv");

                if(!mermaidholder) return;
                //Delete the exisiting child nodes
                while (mermaidholder.firstChild) {
                  mermaidholder.removeChild(mermaidholder.firstChild);
                }
               //Add the new node
               var mermaidnode = document.createElement('div');
               mermaidnode.className = 'mermaid';
               mermaidnode.appendChild(document.createTextNode(graphDefinition));
               mermaidholder.appendChild(mermaidnode);
               mermaid.init();
                
               options.$interval.cancel(int_graphDiv);
                
            },300);
            
          
        }
        
        createGraph();
        
        $scope.$watch('data',function(n,o){
            if(n){
                createGraph();
            }
            
        },true)
       
    }
});
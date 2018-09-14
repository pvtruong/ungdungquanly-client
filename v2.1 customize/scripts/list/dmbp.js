var dmbpModule = new baseInput('dmbp','dmbp',["ma_bp","ten_bp"],'Danh mục bộ phận',{
    has_view:true,
    onLoading:function($scope,options){
        var graphDefinition;
        var edit = function(b){
            $scope.edit(b._id);
        }
        var createChild = function(list,m){
            var chs = _.filter(list,function(b){
                return b.exfields && b.exfields.ma_bp == m.ma_bp;
            })
            chs.forEach(function(bgd){
                graphDefinition = graphDefinition +'\n' + m.ma_bp + '-->' + bgd.ma_bp + '(' + bgd.ten_bp + ')'
                createChild(list,bgd);
            });
            
        }
        $scope.callback = function(id){
            alert(id);
        }
        var createGraph = function(list){
            var mermaidholder = document.querySelector("#graphDiv");
            if(!mermaidholder) return;
            
            graphDefinition = 'graph TD';
            var bpgd = _.filter(list,function(b){
                return !b.exfields || !b.exfields.ma_bp;
            })
            bpgd.forEach(function(bgd){
                graphDefinition = graphDefinition +'\n' + bgd.ma_bp + '(' + bgd.ten_bp + ')'
                graphDefinition = graphDefinition +'\nstyle ' +  bgd.ma_bp  + ' fill:#9f6'
                createChild(list,bgd);
            });
            //event click
            list.forEach(function(item){
                graphDefinition = graphDefinition +'\n' + 'click ' + item.ma_bp + ' "#!/dmbp/view/' + item._id + '"';
            });
            
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
          
        }
        $scope.$watch('list',function(n,o){
            if(n && !_.isEqual(n,o)){
                createGraph(n);
            }
            
        },true)
       
    }
});
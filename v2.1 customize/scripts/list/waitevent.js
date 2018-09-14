var waiteventModule = new baseInput('waitevent','waitevent',["name"],'Chờ đợi sự kiện',{
	onAdd:function($scope,options){
		
	},
	onEdit:function($scope,options){
		
	}
});
waiteventModule.defaultValues = {
    name:'',
	repeat:0,
    type:'after_seconds',
	after_seconds:0
}

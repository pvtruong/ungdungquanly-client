var rptformModule = new baseInput('rptform','rptform',["rptform_name","rptform_type"],'Mẫu báo cáo theo chỉ tiêu',{
    onSaved:function($scope,data,$options){
        $options.$rootScope.openUrl('kbmpttct',{id_rptform:data._id})
    }
});
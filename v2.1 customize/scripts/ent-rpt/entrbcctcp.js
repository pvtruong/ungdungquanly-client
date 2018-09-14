var entrptrbcctcp = new baseRptLink('entrbcctcp','rbcctcp/1','Báo cáo chi tiết chi phí');
entrptrbcctcp.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c; 
	condition.tk='6';
	condition.ma_bp ="";
    condition.ma_phi ="";
    condition.nhomtheo ="ma_phi";
    condition.rptid = 'rbcctcp';
}
entrptrbcctcp.afterLoadData = function($scope,data){
	var datas = _.filter($scope.data,function(d){
            return d.bold===true && d.tk;
        })
        $scope.labels = _.pluck(datas,"tk");
        
        $scope.tien = _.pluck(datas,"tien");
    
        
        $('#container-chart').highcharts({
            
            title: {
                text: ''
            },
            xAxis: {
                categories: $scope.labels
            },
            yAxis: [{
                min: 0,
                title: {
                    text: 'VND'
                },
                labels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            }],
            legend: {
                align: 'right',
                x: -30,
                verticalAlign: 'top',
                y: 25,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black'
                        }
                    }
                }
            },
            series: [
            {
                name: 'Tiền',
                data:  $scope.tien,
                type: 'column',
                yAxis: 0,
                
            }]
        });
}
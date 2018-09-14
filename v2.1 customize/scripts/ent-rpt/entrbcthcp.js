var entrptrbcthcp = new baseRptLink('entrbcthcp','rbcthcp/1','Báo cáo tổng hợp chi phí');
entrptrbcthcp.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c; 
	condition.tk='6';
	condition.ma_bp ="";
    condition.ma_phi ="";
    condition.bctheo ="ma_phi";
    condition.nhomtheo ="";
    condition.rptid = 'rbcthcp';
}
entrptrbcthcp.afterLoadData = function($scope,data){
	var datas = _.filter($scope.data,function(d){
            return d.bold!==true && d.ma;
        })
        $scope.labels = _.pluck(datas,"ma");
        
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
var entbclailotheokh = new baseRptLink('entbclailotheokh','rbcbhtheodoanhso/1','ENT-Báo cáo bán hàng theo số lượng, doanh số và lợi nhuận',{
	onLoading:function($scope,options){
		var $filter = options.$filter;
		var $location = options.$location;
		/*$scope.drilldown = function(row){
			if(row.ma_kh){
				var url ="/entsctcnkh?tk=" + $scope.condition.tk.trim();
				url = url + "&ma_kh=" + row.ma_kh.trim();
				url = url + "&ten_kh=" + row.ten_kh.trim();
				url = url + "&tu_ngay=" + $filter("date")($scope.condition.tu_ngay,"yyyy-MM-dd");
				url = url + "&den_ngay=" + $filter("date")($scope.condition.den_ngay,"yyyy-MM-dd");
				url = url + "&isDrillDown=true"
				$location.url(url);
			}
		}*/
        $scope.series = ['Lợi nhuận','Doanh thu', 'Số lượng'];
	},
    onAfterLoadData:function($scope,data){
        var datas = _.filter($scope.data,function(d){
            return d.bold!==true;
        })
        $scope.labels = _.pluck(datas,"dien_giai");
        
        $scope.so_luong = _.pluck(datas,"so_luong");
        $scope.pt = _.pluck(datas,"pt");
        $scope.lai = _.pluck(datas,"lai");
        
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
            },{
                title: {
                    text: 'Số lượng',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value}',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                opposite: true
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
                name: 'Lợi nhuận',
                data:  $scope.lai,
                type: 'column',
                yAxis: 0,
            },
            {
                name: 'Doanh thu',
                data:  $scope.pt,
                type: 'column',
                yAxis: 0,
                
            },{
                name: 'Số lượng',
                data:  $scope.so_luong,
                type: 'line',
                yAxis: 1,
            }]
        });
    }
});
entbclailotheokh.defaultCondition = function(condition){
	var c = new Date();
	condition.tu_ngay = new Date(c.getFullYear(),c.getMonth(),1);
	condition.den_ngay = c;
    
    condition.tk_vt =""; 
	condition.tk_du ="";
	condition.ma_vt ="";
	condition.ma_kh ="";
	condition.ma_ncc ="";
	condition.ma_kho ="";
	condition.ma_dt ="";
	condition.nvbh ="";
	condition.tinh_dc=1;
	condition.dvcs ="";
	condition.bctheo ="ma_kh";
	condition.nhomtheo ="";
	condition.rptid  = 'rbcbhtheodoanhso';
	condition.nxt = '2';
	condition.ma_ct ='HD2,PBL';
	condition.top =10;
	condition.ma_phi ='';
}

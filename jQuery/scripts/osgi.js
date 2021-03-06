$(document).ready(function () 
{
	var DataExtractor = function () 
	{
        var me = this;
        me.getBundle = function (handler) 
        {
        	$.ajax({
            	url: '../bundles/AllData.xml',              	
            	success: function (data) 
            	{
                    if (handler && data) 
                    {
                        var devices = {};
                        var root = $(data).find('Root');
						                                                    
                        root.children().each(function()
                        {
                            var device = $(this);
                            var did = device.attr('type').toLowerCase();
                            var modules = {};
                                                           
                            device.children().each(function () 
                            {
                            	var module = {};
                            	$(this).children().each(function()
                            	{
                            		module[$(this).prop('tagName').toLowerCase()] = $(this).text();
                            	});
                            	
                            	modules[module.type + '_' + module.room] = module;
                            });
                            devices[did] = modules;
                        });
                        handler(devices);
                    }
                },
                cache: false
        	});
        };
    };
		
	var ContextDataChecker = 
	{
		oldData: undefined,
		curData: undefined,
		isChanged: false,
        onChangeHandler: {},
        setOnChangeHandler: function(handler) 
        {
            if(handler) this.onChangeHandler = handler;
        },
        check: function(extractor) 
        {
        	var me = this;
        	extractor.getBundle(function (devices) 
        	{
                var zstackDevice = devices['zstack'];
                var aspireDevice = devices['aspire'];
                var smartphoneDevice = devices['smartphone'];
                var smartsocketDevice = devices['smartsocket'];  
                var gatewayDevice = devices['gateway'];                         
                
                // Z-Stack Device
				var m110n = zstackDevice['M110_N'];													                    
				var m140a = zstackDevice['M140_A'];
				var m140b = zstackDevice['M140_B'];
				var m160a = zstackDevice['M160_A'];												
				var m170a = zstackDevice['M170_A'];
				var m170b = zstackDevice['M170_B'];												
				var m190a = zstackDevice['M190_A'];							
				
				// Smart Socket Device				
				var screen_a = smartsocketDevice['Screen_A'];
				var light_a = smartsocketDevice['Light_A'];						
				var fan_b = smartsocketDevice['Fan_B'];						
				var lamp_b = smartsocketDevice['Lamp_B'];						
				
				var screenstatus;
				var lightstatus;
				var fanstatus;
				var lampstatus;
				
				if(screen_a == null)
				{
					screenstatus = "N/A";
					var screen_a = new Object; 						
					screen_a.data = "N/A;N/A";
					screen_a.address = "N/A";						
				}
				else
				{
					screenstatus = "on";						
				}
				
				if(light_a == null)
				{
					lightstatus = "N/A";
					var light_a = new Object;
					light_a.data = "N/A;N/A";
					light_a.address = "N/A"
				}
				else
				{
					lightstatus = "on";
				}
				
				if(fan_b == null)
				{
					fanstatus = "N/A";
					var fan_b = new Object;
					fan_b.data = "N/A;N/A";
					fan_b.address = "N/A"
				}
				else
				{
					fanstatus = "on";
				}
				
				if(lamp_b == null)
				{
					lampstatus = "N/A";
					var lamp_b = new Object;
					lamp_b.data = "N/A;N/A";
					lamp_b.address = "N/A";
				}
				else
				{
					lampstatus = "on";
				}
				
				// Smart Phone Device
				var voices = smartphoneDevice['voice_S'];	
				
				// Aspire Device
				var cameras = aspireDevice['camera_S'];													

				// Gateway Device
				var contextaways = gatewayDevice['contextaware_S'];	
				
				urladdress = cameras.address;
				
				me.curData = 
				{
                    // Z-Stack Device
					m110n: zstackDevice['M110_N'],
					m140a: zstackDevice['M140_A'],
					m140b: zstackDevice['M140_B'],														
					m160a: zstackDevice['M160_A'],							
					m170a: zstackDevice['M170_A'],							
					m170b: zstackDevice['M170_B'],														
					m190a: zstackDevice['M190_A'],	

					// Smart Socket Device
					screena: screen_a,	
					lighta: light_a,								
					fanb: fan_b,			
					lampb: lamp_b,
					
					// Smart Phone Device						
					voices: smartphoneDevice['voice_S'],
					
					// Aspire Device
					cameras: aspireDevice['camera_S'],
					urladdress: cameras.address,
					
					// Gateway Device
					contextaways: gatewayDevice['contextaware_S']
				};
				
				var arg = {};
				if(!me.oldData) 
				{
					me.isChanged = true;
				}
				else 
				{      		 	
	            	// compare the type of bg
					if ((me.oldData.m170a.data != me.curData.m170a.data) || (me.oldData.m170b.data != me.curData.m170b.data)
						|| (me.oldData.m110n.data != me.curData.m110n.data) || (me.oldData.m140a.data != me.curData.m140a.data)
						|| (me.oldData.lighta.data != me.curData.lighta.data) || (me.oldData.screena.data != me.curData.screena.data)
						|| (me.oldData.lampb.data != me.curData.lampb.data)	|| (me.oldData.fanb.data != me.curData.fanb.data)
						|| (me.oldData.contextaways.data != me.curData.contextaways.data)
						|| (me.oldData.cameras.data != me.curData.cameras.data)														
						|| (me.oldData.voices.data != me.curData.voices.data)
						|| (me.oldData.cameras.address != me.curData.cameras.address)) 
					{
						me.isChanged = true;
						
	                    var aRoomLightLevel;
						var bRoomLightLevel;
						var voiceState;
						var cameraState;
						var cameraBtn;
						var contextState;
						var screenstatus;
						var lightstatus;
						var fanstatus;
						var lampstatus;	
						var contextonclick;
						                    
						// Determine the level of the light
						if(me.curData.m170a.data < 25)
						{
							// Low
							aRoomLightLevel = 0;																		
						}
						else if(me.curData.m170a.data < 75)
						{
							// Normal
							aRoomLightLevel = 1;
						}
						else if(me.curData.m170a.data <= 100)
						{
							// High
							aRoomLightLevel = 2;
						}

						if(me.curData.m170b.data < 25)
						{
							// Low
							bRoomLightLevel = 0;																		
						}
						else if(me.curData.m170b.data < 75)
						{
							// Normal
							bRoomLightLevel = 1;
						}
						else if(me.curData.m170b.data <= 100)
						{
							// High
							bRoomLightLevel = 2;
						}								
						
						arg.BGURL = 'images/bg' + bRoomLightLevel + "" + aRoomLightLevel + ".png";
						
						// Voice
						if(me.curData.voices.data == "On")
						{
							voiceState = "on";
						}
						else
						{
							voiceState = "off";								
						}
						arg.VOICEURL = 'images/voice' + "_" + voiceState + ".png";
						
						// Camera
						var camerasarray = me.curData.cameras.data.split(';');	
						if(camerasarray[0] == "On")
						{
							cameraState = "on";
						}
						else
						{
							cameraState = "off";								
						}
						arg.CAMERAURL = 'images/camera' + "_" + cameraState + ".png";
						arg.CAMERABTN = cameraBtn;

						// Context away
						var contextawaysarray = me.curData.contextaways.data.split(';');	
						if(contextawaysarray[0] == "On")
						{
							contextState = "on";
							contextonclick = "smart_home_req(9\,\"div_test\")";
						}
						else
						{
							contextState = "off";	
							contextonclick = "smart_home_req(8\,\"div_test\")";
						}							
						arg.CONTEXTURL = 'images/context' + "_" + contextState + ".png";																					
						arg.CONTEXTONCLICK = contextonclick;
						
						var lightaarray = me.curData.lighta.data.split(';'); 
						lightaAddress = me.curData.lighta.address;
						lightaType = me.curData.lighta.type;								
						lightstatus = lightaarray[0];

						var screenaarray = me.curData.screena.data.split(';'); 
						screenaAddress = me.curData.screena.address;
						screenaType = me.curData.screena.type;								
						screenstatus = screenaarray[1];		
													
						var fanbarray = me.curData.fanb.data.split(';'); 														
						fanbAddress = me.curData.fanb.address;
						fanbType = me.curData.fanb.type;								
						fanstatus = fanbarray[1];

						var lampbarray = me.curData.lampb.data.split(';'); 
						lampbAddress = me.curData.lampb.address;
						lampbType = me.curData.lampb.type;								
						lampstatus = lampbarray[1];				

						voicesAddress = me.curData.voices.address;
						voicesType = me.curData.voices.type;								
						voicesData = me.curData.voices.data;				
					}
					else 
					{
						me.isChanged = false;
					}
				}
				
				me.oldData = me.curData;
				arg.Data = me.curData;
            	if(me.isChanged && me.onChangeHandler) 
            	{	
					me.onChangeHandler(arg); 
            	}
			});
        }
    };
        
        
    var IMap = function () 
    {
        var me = this;

        me.updata = function () 
        {
            var pins = $(".pin");
            me.clearDirty();
            pins.each(function () 
            {
                var pin = $(this);
                var tooltipDirection = pin.hasClass('pin-down') ? 'tooltip-down' : 'tooltip-up';
                var tooltip = $('<div class="tooltip">' + pin.html() + '</div>');
                var dirty = $("<div style='left:" + pin.data('xpos') + "px;top:" + pin.data('ypos') + "px' class='" + tooltipDirection + "'></div>");
                dirty.append(tooltip);
                me.wrapper.append(dirty);
            });

            $('.tooltip-up, .tooltip-down').mouseenter(function () 
            {
                $(this).children('.tooltip').fadeIn(100);
            }).mouseleave(function () {
                $(this).children('.tooltip').fadeOut(100);
            })
        };
            
        me.clearDirty = function () 
        {
            me.wrapper.find('.tooltip-down').remove();
            me.wrapper.find('.tooltip-up').remove();                    
        }

        me.wrappedImg = $('#wrapper img');
        if (me.wrappedImg) 
        {
            me.wrapper = $('#wrapper').css(
            {
                'width': me.wrappedImg.width(),
                'height': me.wrappedImg.height()
            });                    
            me.updata();
        }
    };
	modifyUIData();
    var map = new IMap();
        
    ContextDataChecker.setOnChangeHandler(function(arg) 
    {				    			
		var m110n = arg.Data.m110n;							    			
		var m140a = arg.Data.m140a;
		var m140b = arg.Data.m140b;
		var m160a = arg.Data.m160a;    			
		var m170a = arg.Data.m170a;
		var m170b = arg.Data.m170b;
		var m190a = arg.Data.m190a;

		var screena = arg.Data.screena;
		var fanb = arg.Data.fanb;
		var lighta = arg.Data.lighta;
		var lampb = arg.Data.lampb;   
		
		var voices = arg.Data.voices;
		
		var aroomcurrent;
		var broomcurrent;			
		
		var screenstatus;
		var lightstatus;
		var fanstatus;
		var lampstatus;
		
		if(screena == null)
		{
			screenstatus = "N/A";
			var screena = new Object; 						
			screena.data = "N/A;N/A";
		}
		else
		{
			screenstatus = "on";						
		}
		
		if(lighta == null)
		{
			lightstatus = "N/A";
			var lighta = new Object;
			lighta.data = "N/A;N/A";
		}
		else
		{
			lightstatus = "on";
		}
		
		if(fanb == null)
		{
			fanstatus = "N/A";
			var fanb = new Object;
			fanb.data = "N/A;N/A";
		}
		else
		{
			fanstatus = "on";
		}
		
		if(lampb == null)
		{
			lampstatus = "N/A";
			var lampb = new Object;
			lampb.data = "N/A;N/A";
		}
		else
		{
			lampstatus = "on";
		}	
		
		var screenaarray = screena.data.split(';'); 
		var fanbarray = fanb.data.split(';'); 
		var lightaarray = lighta.data.split(';'); 
		var lampbarray = lampb.data.split(';');  	
		
		var screenstatus = screenaarray[0];
		var lightstatus = lightaarray[0];
		var fanstatus = fanbarray[0];
		var lampstatus = lampbarray[0];		    			    					

		// Determine current of a room
		if(lightaarray[1] == null)
		{
			if(screenaarray[1] == null)
			{
				aroomcurrent = 0;
			}
			else
			{
				aroomcurrent = screenaarray[1];
			}
		}
		else
		{
			aroomcurrent = lightaarray[1];
		}
		
		// Determine current of b room
		if(lampbarray[1] == null)
		{
			if(fanbarray[1] == null)
			{
				broomcurrent = 0;
			}
			else
			{
				broomcurrent = fanbarray[1];
			}
		}
		else
		{
			broomcurrent = lampbarray[1];
		}

		$('#voicesAddress').text(voices.address);       
        $('#voicesType').text(voices.type);                  
        $('#voicesData').text(voices.data);                        
		    			
		$('#110nAddress').text(m110n.address);       
        $('#110nType').text(m110n.type);  
        $('#110nData').text(m110n.data);                      

        $('#140aAddress').text(m140a.address);       
        $('#140aType').text(m140a.type);  
        $('#140aData').text(m140a.data); 
                        
        $('#140bAddress').text(m140b.address);       
        $('#140bType').text(m140b.type);  
        $('#140bData').text(m140b.data);    
        
        $('#160aAddress').text(m160a.address);       
        $('#160aType').text(m160a.type);  
        $('#160aData').text(m160a.data);     
        
        $('#170aAddress').text(m170a.address);       
        $('#170aType').text(m170a.type);  
        $('#170aData').text(m170a.data); 
        
        $('#170bAddress').text(m170b.address);       
        $('#170bType').text(m170b.type);  
        $('#170bData').text(m170b.data); 
        
        $('#190aAddress').text(m190a.address);       
        $('#190aType').text(m190a.type);  
        $('#190aData').text(m190a.data);                                                                                    

        $('#screenaAddress').text(screena.address);       
        $('#screenaType').text(screena.type);  
        $('#screenaData').text(screena.data);              
        $('#screenaDataA').text(screenstatus);                                                                                   
        $('#screenaDataB').text(screenaarray[1]);                                                                                                

        $('#lightaAddress').text(lighta.address);       
        $('#lightaType').text(lighta.type);  
        $('#lightaData').text(lighta.data);  
        $('#lightaDataA').text(lightstatus);                                                                                   
        $('#lightaDataB').text(lightaarray[1]);               
        
        $('#fanbAddress').text(fanb.address);       
        $('#fanbType').text(fanb.type);  
        $('#fanbData').text(fanb.data);             
        $('#fanbDataA').text(fanstatus);                                                                                   
        $('#fanbDataB').text(fanbarray[1]);                                                                                                                   
        
        $('#lampbAddress').text(lampb.address);       
        $('#lampbType').text(lampb.type);  
        $('#lampbData').text(lampb.data);  
        $('#lampbDataA').text(lampstatus);                                                                                   
        $('#lampbDataB').text(lampbarray[1]);                                                                                                 

		$('#bgsrc').attr('src', arg.BGURL);
		$('#voicessrc').attr('src', arg.VOICEURL);			
		$('#camerasrc').attr('src', arg.CAMERAURL);
		$('#camerabtn').attr('onclick', arg.CAMERABTN);					
		$('#contextsrc').attr('src', arg.CONTEXTURL);	
		$('#aroomcurrent').text(aroomcurrent);	
		$('#broomcurrent').text(broomcurrent);	
		$('#contextonclick').attr('onclick', arg.CONTEXTONCLICK);			
		
        map.updata(); 
    });    
    
    var extractor = new DataExtractor();           
    setInterval(modifyUIData, 3000, extractor);

    function modifyUIData(extractor) 
    {
    	if(extractor) ContextDataChecker.check(extractor);
    }
});

	var urladdress;

	function FP_preloadImgs() 
	{//v1.0
	 var d=document,a=arguments; if(!d.FP_imgs) d.FP_imgs=new Array();
	 for(var i=0; i<a.length; i++) { d.FP_imgs[i]=new Image; d.FP_imgs[i].src=a[i]; }
	}

	function FP_swapImg() {//v1.0
	 var doc=document,args=arguments,elm,n; doc.$imgSwaps=new Array(); for(n=2; n<args.length;
	 n+=2) { elm=FP_getObjectByID(args[n]); if(elm) { doc.$imgSwaps[doc.$imgSwaps.length]=elm;
	 elm.$src=elm.src; elm.src=args[n+1]; } }
	}

	function FP_getObjectByID(id,o) {//v1.0
	 var c,el,els,f,m,n; if(!o)o=document; if(o.getElementById) el=o.getElementById(id);
	 else if(o.layers) c=o.layers; else if(o.all) el=o.all[id]; if(el) return el;
	 if(o.id==id || o.name==id) return o; if(o.childNodes) c=o.childNodes; if(c)
	 for(n=0; n<c.length; n++) { el=FP_getObjectByID(id,c[n]); if(el) return el; }
	 f=o.forms; if(f) for(n=0; n<f.length; n++) { els=f[n].elements;
	 for(m=0; m<els.length; m++){ el=FP_getObjectByID(id,els[n]); if(el) return el; } }
	 return null;
	}
// -->
	function smart_home_req(val, obj_name)
	{
		var msg = new Array();
		
		msg[0]='http://' + urladdress + ':8000/?type=Lamp&data=on&filter=socket';
		msg[1]='http://' + urladdress + ':8000/?type=Lamp&data=off&filter=socket';
		msg[2]='http://' + urladdress + ':8000/?type=Screen&data=on&filter=socket';
		msg[3]='http://' + urladdress + ':8000/?type=Screen&data=off&filter=socket';
		msg[4]='http://' + urladdress + ':8000/?type=Light&data=on&filter=socket';
		msg[5]='http://' + urladdress + ':8000/?type=Light&data=off&filter=socket';
		msg[6]='http://' + urladdress + ':8000/?type=Fan&data=on&filter=socket';
		msg[7]='http://' + urladdress + ':8000/?type=Fan&data=off&filter=socket';			
		msg[8]='http://' + urladdress + ':8000/?filter=contextaware&status=online';
		msg[9]='http://' + urladdress + ':8000/?filter=contextaware&status=offline';
		
		$.get(msg[val], function(data){check_error(data,val,obj_name)});
	}

	function check_error(data,val,obj_name)
	{
		//var obj_id='div_test';
		if(data=="Fail\n"){
			setTimeout(function(){smart_home_req(val,obj)},1000);
		}
		else{
			var obj = document.getElementById(obj_name);
			obj.innerHTML = data;//Return Message
		}
	}
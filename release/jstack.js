var JSTACK=JSTACK||{};JSTACK.VERSION="0.1";JSTACK.AUTHORS="GING";JSTACK.Comm=function(c,e){var f;f=function(c,g,b,a,d,h){var i,f;i=new XMLHttpRequest;i.open(c,g,!0);i.setRequestHeader("Content-Type","application/json");i.setRequestHeader("Accept","application/json");i.onreadystatechange=function(){if(4===i.readyState)switch(i.status){case 100:case 200:case 201:case 202:case 203:case 204:case 205:f=e;i.responseText!==e&&""!==i.responseText&&(f=JSON.parse(i.responseText));d(f);break;case 400:h("400 Bad Request");break;case 401:h("401 Unauthorized");break;case 403:h("403 Forbidden");
break;default:h(i.status+" Error")}};a!==e&&i.setRequestHeader("X-Auth-Token",a);b!==e?(c=JSON.stringify(b),i.send(c)):i.send()};return{get:function(c,g,b,a){f("GET",c,e,g,b,a)},post:function(c,g,b,a,d){f("POST",c,g,b,a,d)},put:function(c,g,b,a,d){f("PUT",c,g,b,a,d)},del:function(c,g,b,a){f("DELETE",c,e,g,b,a)}}}(JSTACK);JSTACK.Utils=function(c){var e,f;e=function(c){var g="",b,a,c=c.replace(/\r\n/g,"\n");for(b=0;b<c.length;b+=1)a=c.charCodeAt(b),128>a?g+=String.fromCharCode(a):(127<a&&2048>a?g+=String.fromCharCode(a>>6|192):(g+=String.fromCharCode(a>>12|224),g+=String.fromCharCode(a>>6&63|128)),g+=String.fromCharCode(a&63|128));return g};f=function(c){for(var g="",b=0,a=0,d=0,h=0;b<c.length;)a=c.charCodeAt(b),128>a?(g+=String.fromCharCode(a),b+=1):191<a&&224>a?(d=c.charCodeAt(b+1),g+=String.fromCharCode((a&31)<<
6|d&63),b+=2):(d=c.charCodeAt(b+1),h=c.charCodeAt(b+2),g+=String.fromCharCode((a&15)<<12|(d&63)<<6|h&63),b+=3);return g};return{encode:function(f){for(var g="",b,a,d,h,i,k,l=0,f=e(f);l<f.length;)b=f.charCodeAt(l+=1),a=f.charCodeAt(l+=1),d=f.charCodeAt(l+=1),h=b>>2,b=(b&3)<<4|a>>4,i=(a&15)<<2|d>>6,k=d&63,isNaN(a)?i=k=64:isNaN(d)&&(k=64),g=g+c.Utils.keyStr.charAt(h)+Base64.keyStr.charAt(b)+c.Utils.keyStr.charAt(i)+Base64.keyStr.charAt(k);return g},decode:function(e){for(var g="",b,a,d,h,i,k=0,e=e.replace(/[^A-Za-z0-9\+\/\=]/g,
"");k<e.length;)b=c.Utils.keyStr.indexOf(e.charAt(k+=1)),a=c.Utils.keyStr.indexOf(e.charAt(k+=1)),h=c.Utils.keyStr.indexOf(e.charAt(k+=1)),i=c.Utils.keyStr.indexOf(e.charAt(k+=1)),b=b<<2|a>>4,a=(a&15)<<4|h>>2,d=(h&3)<<6|i,g+=String.fromCharCode(b),64!==h&&(g+=String.fromCharCode(a)),64!==i&&(g+=String.fromCharCode(d));return g=f(g)}}}(JSTACK);JSTACK.Keystone=function(c,e){var f,j;j={DISCONNECTED:0,AUTHENTICATING:1,AUTHENTICATED:2,AUTHENTICATION_ERROR:3};f={url:e,currentstate:e,access:e,token:e};return{STATES:j,params:f,init:function(c,b){console.log("Admin URL"+b);f.url=c;f.adminUrl=b;f.access=e;f.token=e;f.currentstate=j.DISCONNECTED},authenticate:function(g,b,a,d,h,i){var k={},k=a!==e?{auth:{token:{id:a}}}:{auth:{passwordCredentials:{username:g,password:b}}};d!==e&&(k.auth.tenantId=d);f.currentstate=j.AUTHENTICATING;c.Comm.post(f.url+
"tokens",k,e,function(a){f.currentstate=c.Keystone.STATES.AUTHENTICATED;f.access=a.access;f.token=f.access.token.id;h!==e&&h(a)},function(a){f.currentstate=j.AUTHENTICATION_ERROR;i(a)})},gettenants:function(g){f.currentstate===c.Keystone.STATES.AUTHENTICATED&&c.Comm.get(f.url+"tenants",f.token,function(c){g!==e&&g(c)},function(c){throw Error(c);})},getservice:function(c){var b,a;if(f.currentstate!==j.AUTHENTICATED)return e;for(b in f.access.serviceCatalog)if(f.access.serviceCatalog[b]!==e&&(a=f.access.serviceCatalog[b],
c===a.type))return a;return e},getservicelist:function(){return f.currentstate!==j.AUTHENTICATED?e:f.access.serviceCatalog},createuser:function(g,b,a,d,h,i,e){f.currentstate===c.Keystone.STATES.AUTHENTICATED&&c.Comm.post(f.adminUrl+"users",{user:{name:g,password:b,tenantId:a,email:d,enabled:h}},f.token,i,e)},getusers:function(g,b,a){if(f.currentstate===c.Keystone.STATES.AUTHENTICATED){var d="",d=g!==e?f.adminUrl+"tenants/"+g+"/users":f.adminUrl+"users";c.Comm.get(d,f.token,b,a)}},getuser:function(e,
b,a){f.currentstate===c.Keystone.STATES.AUTHENTICATED&&c.Comm.get(f.adminUrl+"users/"+e,f.token,b,a)},deleteuser:function(e,b,a){f.currentstate===c.Keystone.STATES.AUTHENTICATED&&c.Comm.del(f.adminUrl+"users/"+e,f.token,b,a)},getuserroles:function(g,b,a,d){if(f.currentstate===c.Keystone.STATES.AUTHENTICATED){var h="",h=b!==e?f.adminUrl+"tenants/"+b+"/users/"+g+"/roles":f.adminUrl+"users/"+g+"/roles";c.Comm.get(h,f.token,a,d)}},getroles:function(e,b){f.currentstate===c.Keystone.STATES.AUTHENTICATED&&
c.Comm.get(f.adminUrl+"OS-KSADM/roles",f.token,e,b)},adduserrole:function(g,b,a,d,h){if(f.currentstate===c.Keystone.STATES.AUTHENTICATED){var i="",i=a!==e?f.adminUrl+"tenants/"+a+"/users/"+g+"/roles/OS-KSADM/"+b:f.adminUrl+"users/"+g+"/roles/OS-KSADM/"+b;c.Comm.put(i,{},f.token,d,h)}},removeuserrole:function(g,b,a,d,h){if(f.currentstate===c.Keystone.STATES.AUTHENTICATED){var i="",i=a!==e?f.adminUrl+"tenants/"+a+"/users/"+g+"/roles/OS-KSADM/"+b:f.adminUrl+"users/"+g+"/roles/OS-KSADM/"+b;c.Comm.del(i,
f.token,d,h)}},createtenant:function(e,b,a,d,h){f.currentstate===c.Keystone.STATES.AUTHENTICATED&&c.Comm.post(f.adminUrl+"tenants",{tenant:{name:e,description:b,enabled:a}},f.token,d,h)},deletetenant:function(e,b,a){f.currentstate===c.Keystone.STATES.AUTHENTICATED&&c.Comm.del(f.adminUrl+"tenants"+e,data,f.token,b,a)}}}(JSTACK);JSTACK.Nova=function(c,e){var f,j,g,b;f=e;j="publicURL";g=function(){return c.Keystone!==e&&c.Keystone.params.currentstate===c.Keystone.STATES.AUTHENTICATED?(f=c.Keystone.getservice("compute").endpoints[0][j],!0):!1};b=function(a,d,h,b){g()&&(a=f+"/servers/"+a+"/action",c.Comm.post(a,d,c.Keystone.params.token,function(a){b!==e&&b(a)},function(a){throw Error(a);}))};return{configure:function(a){if("adminURL"===a||"internalURL"===a||"publicURL"===a)j=a},getserverlist:function(a,d,h){var b;g()&&(b=f+
"/servers",a!==e&&a&&(b+="/detail"),d&&(b+="?all_tenants="+d),c.Comm.get(b,c.Keystone.params.token,function(a){h!==e&&h(a)},function(a){throw Error(a);}))},getserverdetail:function(a,d){var h;g()&&(h=f+"/servers/"+a,c.Comm.get(h,c.Keystone.params.token,function(a){d!==e&&d(a)},function(a){throw Error(a);}))},getserverips:function(a,d,h){g()&&(a=f+"/servers/"+a+"/ips",d!==e&&(a+="/"+d),c.Comm.get(a,c.Keystone.params.token,function(a){h!==e&&h(a)},function(a){throw Error(a);}))},updateserver:function(a,
d,h){g()&&(a=f+"/servers/"+a,d!==e&&c.Comm.put(a,{server:{name:d}},c.Keystone.params.token,function(a){h!==e&&h(a)},function(a){throw Error(a);}))},createserver:function(a,d,h,b,k,j,m,n,o,p){var r=[],q;if(g()){a={server:{name:a,imageRef:d,flavorRef:h}};b!==e&&(a.server.key_name=b);k!==e&&(a.server.user_data=c.Utils.encode(k));if(j!==e){for(q in j)j[q]!==e&&(b={name:j[q]},r.push(b));a.server.security_groups=r}m===e&&(m=1);a.server.min_count=m;n===e&&(n=1);a.server.max_count=n;o!==e&&(a.server.availability_zone=
c.Utils.encode(o));c.Comm.post(f+"/servers",a,c.Keystone.params.token,function(a){p!==e&&p(a)},function(a){throw Error(a);})}},deleteserver:function(a,d){var b;g()&&(b=f+"/servers/"+a,c.Comm.del(b,c.Keystone.params.token,function(a){d!==e&&d(a)},function(a){throw Error(a);}))},changepasswordserver:function(a,d,c){d!==e&&b(a,{changePassword:{adminPass:d}},c)},rebootserverhard:function(a,d){b(a,{reboot:{type:"HARD"}},d)},rebootserversoft:function(a,d){b(a,{reboot:{type:"SOFT"}},d)},resizeserver:function(a,
d,c){b(a,{resize:{flavorRef:d}},c)},confirmresizedserver:function(a,d){b(a,{confirmResize:null},d)},revertresizedserver:function(a,d){b(a,{revertResize:null},d)},startserver:function(a,d){b(a,{"os-start":null},d)},stopserver:function(a,d){b(a,{"os-stop":null},d)},pauseserver:function(a,d){b(a,{pause:null},d)},unpauseserver:function(a,d){b(a,{unpause:null},d)},suspendserver:function(a,d){b(a,{suspend:null},d)},resumeserver:function(a,d){b(a,{resume:null},d)},createimage:function(a,d,c,f){d={createImage:{name:d}};
d.createImage.metadata={};c!==e&&(d.createImage.metadata=c);b(a,d,f)},getflavorlist:function(a,d){var b;g()&&(b=f+"/flavors",a!==e&&a&&(b+="/detail"),c.Comm.get(b,c.Keystone.params.token,function(a){d!==e&&d(a)},function(a){throw Error(a);}))},getflavordetail:function(a,d){var b;g()&&(b=f+"/flavors/"+a,c.Comm.get(b,c.Keystone.params.token,function(a){d!==e&&d(a)},function(a){throw Error(a);}))},createflavor:function(a,d,b,i,k,j,m,n,o){var p;g()&&(p=f+"/flavors",a={flavor:{name:a,ram:d,vcpus:b,disk:i,
id:k,swap:0,"OS-FLV-EXT-DATA:ephemeral":0,rxtx_factor:0}},j!==e&&(a.flavor["OS-FLV-EXT-DATA:ephemeral"]=j),m!==e&&(a.flavor.swap=m),n!==e&&(a.flavor.rxtx_factor=n),c.Comm.post(p,a,c.Keystone.params.token,function(a){o!==e&&o(a)},function(a){throw Error(a);}))},deleteflavor:function(a,d){var b;g()&&(b=f+"/flavors/"+a,c.Comm.del(b,c.Keystone.params.token,function(a){d!==e&&d(a)},function(a){throw Error(a);}))},getimagelist:function(a,d){var b;g()&&(b=f+"/images",a!==e&&a&&(b+="/detail"),c.Comm.get(b,
c.Keystone.params.token,function(a){d!==e&&d(a)},function(a){throw Error(a);}))},getimagedetail:function(a,d){var b;g()&&(b=f+"/images/"+a,c.Comm.get(b,c.Keystone.params.token,function(a){d!==e&&d(a)},function(a){throw Error(a);}))},deleteimage:function(a,d){var b;g()&&(b=f+"/images/"+a,c.Comm.del(b,c.Keystone.params.token,function(a){d!==e&&d(a)},function(a){throw Error(a);}))},getkeypairlist:function(a){var b;g()&&(b=f+"/os-keypairs",c.Comm.get(b,c.Keystone.params.token,function(b){a!==e&&a(b)},
function(a){throw Error(a);}))},createkeypair:function(a,b,h){var i;g()&&(i=f+"/os-keypairs",a={keypair:{name:a}},b!==e&&(a.keypair.public_key=b),c.Comm.post(i,a,c.Keystone.params.token,function(a){h!==e&&h(a)},function(a){throw Error(a);}))},deletekeypair:function(a,b){var h;g()&&(h=f+"/os-keypairs/"+a,c.Comm.del(h,c.Keystone.params.token,function(a){b!==e&&b(a)},function(a){throw Error(a);}))},getvncconsole:function(a,d,c){if(g()){if(d===e||!d)d="novnc";b(a,{"os-getVNCConsole":{type:d}},null,c)}},
getconsoleoutput:function(a,d,c){if(g()){if(d===e||!d)d=35;b(a,{"os-getConsoleOutput":{length:d}},null,c)}},getattachedvolumes:function(a,b){var h;g()&&(h=f+"/servers/"+a+"/os-volume_attachments",c.Comm.get(h,c.Keystone.params.token,function(a){b!==e&&b(a)},function(a){throw Error(a);}))},attachvolume:function(a,b,h,i){g()&&(a=f+"/servers/"+a+"/os-volume_attachments",b===e||h===e||c.Comm.post(a,{volumeAttachment:{volumeId:b,device:h}},c.Keystone.params.token,function(a){i!==e&&i(a)},function(a){throw Error(a);
}))},detachvolume:function(a,b,h){g()&&(a=f+"/servers/"+a+"/os-volume_attachments/"+b,b!==e&&c.Comm.del(a,c.Keystone.params.token,function(a){h!==e&&h(a)},function(a){throw Error(a);}))},getattachedvolume:function(a,b,h){g()&&(a=f+"/servers/"+a+"/os-volume_attachments/"+b,b!==e&&c.Comm.get(a,c.Keystone.params.token,function(a){h!==e&&h(a)},function(a){throw Error(a);}))}}}(JSTACK);JSTACK.Nova.Volume=function(c,e){var f,j,g;f=e;j="publicURL";g=function(){return c.Keystone!==e&&c.Keystone.params.currentstate===c.Keystone.STATES.AUTHENTICATED?(f=c.Keystone.getservice("volume").endpoints[0][j],!0):!1};return{configure:function(b){if("adminURL"===b||"internalURL"===b||"publicURL"===b)j=b},getvolumelist:function(b,a){var d;g()&&(d=f+"/volumes",b!==e&&b&&(d+="/detail"),c.Comm.get(d,c.Keystone.params.token,function(b){a!==e&&a(b)},function(a){throw Error(a);}))},createvolume:function(b,
a,d,h){g()&&(b={volume:{size:b}},a!==e&&(b.volume.display_name=a),d!==e&&(b.volume.display_description=d),c.Comm.post(f+"/volumes",b,c.Keystone.params.token,function(a){h!==e&&h(a)},function(a){throw Error(a);}))},deletevolume:function(b,a){var d;g()&&(d=f+"/volumes/"+b,c.Comm.del(d,c.Keystone.params.token,function(b){a!==e&&a(b)},function(a){throw Error(a);}))},getvolume:function(b,a){var d;g()&&(d=f+"/volumes/"+b,c.Comm.get(d,c.Keystone.params.token,function(b){a!==e&&a(b)},function(a){throw Error(a);
}))},getsnapshotlist:function(b,a){var d;g()&&(d=f+"/snapshots",b!==e&&b&&(d+="/detail"),c.Comm.get(d,c.Keystone.params.token,function(b){a!==e&&a(b)},function(a){throw Error(a);}))},createsnapshot:function(b,a,d,h){g()&&(b={snapshot:{volume_id:b,force:!0}},a!==e&&(b.snapshot.display_name=a),d!==e&&(b.snapshot.display_description=d),c.Comm.post(f+"/snapshots",b,c.Keystone.params.token,function(a){h!==e&&h(a)},function(a){throw Error(a);}))},deletesnapshot:function(b,a){var d;g()&&(d=f+"/snapshots/"+
b,c.Comm.del(d,c.Keystone.params.token,function(b){a!==e&&a(b)},function(a){throw Error(a);}))},getsnapshot:function(b,a){var d;g()&&(d=f+"/snapshots/"+b,c.Comm.get(d,c.Keystone.params.token,function(b){a!==e&&a(b)},function(a){throw Error(a);}))}}}(JSTACK);JSTACK.Glance=function(c,e){var f,j,g;f=e;j="publicURL";g=function(){return c.Keystone!==e&&c.Keystone.params.currentstate===c.Keystone.STATES.AUTHENTICATED?(f=c.Keystone.getservice("image").endpoints[0][j],!0):!1};return{configure:function(b){if("adminURL"===b||"internalURL"===b||"publicURL"===b)j=b},getimagelist:function(b,a){var d;g()&&(d=f+"/images",b!==e&&b&&(d+="/detail"),c.Comm.get(d,c.Keystone.params.token,function(b){a!==e&&a(b)},function(a){throw Error(a);}))}}}(JSTACK);

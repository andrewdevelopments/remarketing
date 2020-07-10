// :: andrewdevelopments
// Remarketing, segmentation and tracking script
// Please be carefull with this!
// v1.0

var
userRef,
object = cvx_settings,
qe = {
	version: '1.0',

	// Api endpoint
	qapi: '//dashboard.edition.ro/api-',
	defaults: {
		datenow: new Date().getTime(),
		// If is an open source platform ? true : false
		shop: true,
		currency: 'Lei',
	},
	actions: {
		product: {},
		cart: {
			update: 'test',
			cartProductTitle: '.cart-product-name a'
		},
	},
	modules: {
		msgr: {
			_appID: '297295760758008',
			_version: 'v2.6',
			_cartSessionDefault: 60,
			_api: {
				// Api tracker endpoint
				__default: '//tracking.edition.ro/api/',
				// __update: 'update',
				// __remove: 'removed',
			},
			_cart: {

				// Add _cvx product in storage
				__add: function() {

					$(object.platform.product.add_to_cart_btn).on('click', function() {
						qode.product.quantity = $(object.platform.product.quantity).val();
						qe.component._storage.__set( '_cvx.p_' + qode.product.id, JSON.stringify(qode.product) );
					});
				},
				__variableQty: function() {
					$(object.platform.product.quantity).on('focus focusout', function() {
						qode.product.quantity = $(this).val();
					});
					return qode.product.quantity;
				},
				__update: function() {

					$(object.platform.cart.update).on('mouseover', function() {
						// console.log( $(object.platform.cart.updateInput).val() );
						// console.log( qe.component._localItemsSpecific( '_cvx' ) );

					});

				},
				__remove: function() {
					$(object.platform.cart.remove).on('click', function() {

						var
						// Match product by name
						matcher = $(this).parents('tr').find('.text-left a').text(),
						searcher = qe.component._localItemsSpecific( '_cvx', matcher );

						// console.log(matcher);
						// console.log(searcher);

						var
						objStorage = localStorage.getItem( searcher[0].key ),
						obj = JSON.parse(objStorage),
						id = obj.id,
						image = obj.image,
						name = obj.name,
						old_price = obj.old_price,
						price = obj.price,
						quantity = obj.quantity,
						url = obj.url,
						distinct_name = qe.component._distinct.__get() ? qe.component._distinct.__get().name : '',
						distinct_time = qe.component._distinct.__get() ? qe.component._distinct.__get().time : '',
						constructor = {
							uid: qode.facebook.ID,
							pid: qode.facebook.page,
							type: 'removed',
							productsID: id,
							timestamp: qe.defaults.datenow,
							productQuery: objStorage,
							distinct: distinct_name,
							distinctTime: distinct_time,
							referral: qe.modules.msgr._session.__id()
						};

						// We must add $info->uid .'-'. $info->pid from Laravel -> controller -> api -> order
						qe.component._send( qe.qapi + 'removed', constructor );

						// Remove component from Storage
						localStorage.removeItem( searcher[0].key );

					});
				},
				__checkout: function() {
					var
					distinct_name = qe.component._distinct.__get() ? qe.component._distinct.__get().name : '',
					distinct_time = qe.component._distinct.__get() ? qe.component._distinct.__get().time : '',
					obj = {
						uid: qode.facebook.ID,
						pid: qode.facebook.page,
						type: 'checkout',
						timestamp: qe.defaults.datenow,
						distinct: distinct_name,
						distinctTime: distinct_time,
						referral: qe.modules.msgr._session.__id()
					};
					$('#checkout-cart .pull-right a, #cart .text-right a').on('click', function() {
						if( $(this).attr('href').indexOf('/checkout') != -1 || $(this).attr('href').indexOf('checkout/checkout') != -1 ) {

							var
							items = qe.component._localItems('_cvx'),
							ids = new Array(), data = new Array();

							for( var i = 0; i < items.length; i++ ) {
								ids[i] = items[i].val.id;
								data[i] = JSON.stringify(items[i].val);
							}

							obj.ids = ids.toString();
							obj.data = JSON.stringify(data);

							qe.component._send( qe.qapi + 'checkout', obj );

							console.log(obj);

						}
					});
				},

				// Product session expired, e.g products will not be available in cart session
				__expired: function() {

					var obj = qe.component._localItems('_cvx');

					if( obj.length > 0 ) {
						for( var i = 0; i < obj.length; i++ ) {
							var
							time = obj[i].val.timestamp,
							defaultSession = qe.modules.msgr._cartSessionDefault,
							timePlus = time + ( defaultSession * 60 * 1000 ),
							now = qe.defaults.datenow;

							// last _qodid storage session

							// "{"name":"fbmcvxdistinctfiCich7wqCoC","time":1559743579024,"products":1}"
							// _qodid_ready: "1"

							if( timePlus < now ) {

								// console.log( 'object ' + obj[i].key + ' must be removed, session has expired' );
								localStorage.removeItem( obj[i].key );

							}

						}
					}

				}
			},
			_session: {
				__read: function() {
					if( qe.cookies._get('__cvx_fbCart') ) {
						return qe.cookies._get('__cvx_fbCart').split('&');
					}
				},
				__status: function() {
					if( this.__read() ) {
						var a = this.__read()[0],
							b = a.replace('status=', ''), c;
						return ( typeof b == 'string' && b == 'true' ) ? true : false;
					}
				},
				__id: function() {
					if( this.__read() ) {
						return this.__read()[1].split('id=')[1];
					}
				}
			},
			_analytics: {
				__code: function() {

				},
				__cartUpdated: function() {

				},
				__cartConfirmed: function() {

				},
			},
			_apiActions: {
				// Set actions in cookies: Add to cart, Update product, Remove product
				__addToCart: function() {
					$(object.platform.product.add_to_cart_btn).on('click', function() {
						if( !qe.modules.msgr._session.__status() ) {
							qe.cookies._set( '__cvx_fbCart', 'status=' + fbCartStatus + '&id=' + fbkRefID , 365, '/', '' );
						}
						confirmOptIn();
					});
				},
				__update: function() {

				},
				__remove: function() {

					var data = {
						uid: object.cvxID,
						pid: object.fbpID,
						distinct: qe.component._distinct.__get() ? qe.component._distinct.__get().name : '',
						distinct_time: qe.component._distinct.__get() ? qe.component._distinct.__get().time : '',
						products: qode.product
					};

					console.log( data );

				}
			},
			_moduleInit: function() {

				// Start module
				qode.facebook = {
					status: object.fbpID || object.fbpID !== '' ? true : false,
					ID: object.cvxID || object.cvxID !== '' ? object.cvxID : '',
					page: object.fbpID || object.fbpID !== '' ? object.fbpID : '',
				};

				qe.component._distinct.__check();

				// Initialize cart functions
				this._cart.__add();
				this._cart.__update();
				this._cart.__remove();
				this._cart.__checkout();
				this._cart.__expired();

				// Initialize messenger analytics
				this._analytics.__cartUpdated();
				this._analytics.__cartConfirmed();

			}
		}
	},
	cookies: {
		_set: function( name, value, days, path, domain ) {

			if( days === undefined ) {
				days = 1;
			}

			var date = new Date();
			date.setTime( date.getTime() + ( days * 24 * 60 * 60 * 1000 ) );
			var expiration = 'expires=' + date.toUTCString();

			document.cookie = name + '=' + value + ';' + expiration + ';path='+ path +';domain=' + domain;

		},
		_get: function( name ) {

			var
			a = document.cookie.indexOf( name + '=' ),
			b = a + name.length + 1,
			c = document.cookie.indexOf( ';', b );

			if( (!a) && (name !== document.cookie.substring(0, name.length)) ) {
				return null;
			}
			if( a == -1 ) {
				return null;
			}
			if( c == -1 ) {
				c = document.cookie.length;
			}

			return unescape( document.cookie.substring( b, c ) );

		}
	},
	component: {
		_encode: function( data ) {
			return btoa( encodeURIComponent(JSON.stringify(data)) );
		},
		_decode: function( data ) {
			return JSON.parse( decodeURIComponent(atob(data)) );
		},
		_browser: function() {},
		_device: function() {},
		_localItems: function( query ) {

			var i, results = [];
			for( i in localStorage ) {
				if( localStorage.hasOwnProperty(i) ) {
					if( i.match(query) || ( !query && typeof i === 'string' ) ) {
						value = JSON.parse( localStorage.getItem(i) );
						results.push({
							key: i,
							val: value
						});
					}
				}
			}
			return results;

		},
		_localItemsSpecific: function( query, returnerMatcher ) {
			var items = this._localItems( query ), object = [];
			for( var i = 0; i < items.length; i++ ) {
				if( items[i].val.name.indexOf(returnerMatcher) !== -1 ) {
					object.push(items[i]);
				}
			}
			return object;
		},
		_send: function( url, data ) {
			$.ajax({
				url: url,
				type: 'POST',
				dataType: 'json',
				data: JSON.stringify( data ),
			}).done();
		},
		_uuid: function() {

			var
			date = qe.defaults.datenow,
			constructor = 'xxxxxxxx-xxxx-CVXxxxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function(c) {
		        var r = ( date + Math.random() * 16 ) % 16 | 0;
		        date = Math.floor( date / 16 );
		        return ( c == 'x' ? r :( r&0x3|0x8 ) ).toString(16);
	    	} );
			return constructor;

		},
		_tolower: function( data ) {
			return void 0 == data && ( data = '' ), isNaN( data ) ? data.toLowerCase() : data;
		},
		_distinct: {
			__set: function() {

				var
				alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
				length = 12,
				constructor = 'fbmcvxdistinct';

				for( var i = 0; i < length; i++ ) {
					constructor += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
				}

				return constructor;

			},
			__add: function() {

				var obj = {
					name: this.__set(),
					time: qe.defaults.datenow,
					products: qe.component._localItems('_cvx').length
				};

				qe.component._storage.__set( '_qodid', JSON.stringify(obj) );
				qe.component._storage.__set( '_qodid_ready', '0' );

			},
			__remove: function() {
				localStorage.removeItem('_qodid');
			},
			__get: function() {

				var obj = JSON.parse( localStorage.getItem('_qodid') );

				return obj;

			},
			__check: function() {

				if( qe.component._storage.__get('_qodid') ) {
					var obj = JSON.parse(localStorage.getItem('_qodid'));
					obj.products = qe.component._localItems('_cvx').length;
					qe.component._storage.__set( '_qodid', JSON.stringify(obj) );
				}

				if( qe.component._localItems('_cvx').length > 0 ) {
					localStorage.setItem('_qodid_ready', '1');
				}

				if( qe.component._localItems('_cvx').length == 0 || localStorage.getItem('_qodid') == null ) {
					// this.__remove();
					localStorage.setItem('_qodid_ready', '0');
				}

				if( qe.component._storage.__get('_qodid_ready') == '0' ) {
					this.__add();
				}

				// return localStorage.getItem('_qodid');

			}
		},
		_buildDistinct: function( start, middle, end ) {
			return this._encode( this._tolower('p_c_' + start + '_v_' + middle + '_x_' + end) );
		},
		_time: {
			__set: function() {

			},
			__get: function() {

			}
		},
		_storage: {
			__set: function( name, data ) {
				localStorage.setItem(name, data);
			},
			__get: function( name ) {
				return localStorage.getItem(name);
			}
		},
		_session: {
			__builder: function() {
				var
				date = qe.defaults.datenow,
				uid = 'xxxxxxxxxxxxCVXSSIDxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			        var r = (date + Math.random()*16)%16 | 0;
			        date = Math.floor(date/16);
			        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
		    	});
		    	return uid;
			},
			__set: function() {

				if( sessionStorage.getItem('CVXSSID') != null || sessionStorage.getItem('CVXSSID') != '' ) {
					sessionStorage.setItem( 'CVXSSID', this.__builder() );
				}

			},
			__get: function() {
				if( sessionStorage.getItem('CVXSSID') != null || sessionStorage.getItem('CVXSSID') != '' ) {
					return sessionStorage.getItem('CVXSSID');
				}
			}
		}
	},
	platforms: {
		// OpenCart platform
		_oc: function() {

			var id, atcBtn, image, price, old_price, qty, title, quantity, url, type, referee, time, page_id, distinct;
			if( typeof object.platform.product == 'object' || Object.keys(object.platform.product).length > 0 ) {

				// ========= Product page
				var
				extractID = object.platform.product.id;
				// pID = $(extractID)[0].classList[0];
				// pID = $(extractID)[0].id;

				if( $(extractID).length ) {

					var
					// Extract ID
					// IDmatch = pID.match(/\d+/),
					// Extract Image
					imageObj = object.platform.product.image,

					// Extract Price
					priceObj = object.platform.product.price,
					priceExtractor = $(priceObj).html().match(/\d+/g).toString().replace(',', '.'),

					oldPriceExtractor = $(object.platform.product.old_price).length ? $(object.platform.product.old_price).html().match(/\d+/g).toString().replace(',', '.') + ' ' + qe.defaults.currency : '',

					// Extract Quantity
					qtyObj = $(object.platform.product.quantity).attr('value');


					// Type of action
					type = 'add_to_cart';
					id = $(object.platform.product.id).attr('value');
					image = $(imageObj)[0].src;
					price = priceExtractor + ' ' + qe.defaults.currency;
					old_price = oldPriceExtractor;
					quantity = qtyObj;
					url = window.location.href;
					referee = qe.modules.msgr._session.__id();
					time = qe.defaults.datenow;
					page_id = object.fbpID;
					name = $(object.platform.product.title).text();
					// distinct = qe.component._buildDistinct( id, name, priceExtractor );

					return qode.product = {
						type: type,
						name: name,
						id: id,
						image: image,
						price: price,
						old_price: old_price,
						quantity: quantity,
						url: url,
						// referee: referee,
						// distinct: distinct,
						timestamp: time,
						// page_id: page_id,
					};

				}

			}

		},
		// Magento platform
		_magento: function() {
			console.log('we are on magento');
		},
		// Custom ecommerce platform
		_custom: function() {

		},
		// Platform detector
		_detect: function() {
			switch( qe.component._tolower( object.platform.name ) ) {
				case 'opencart':
					qe.platforms._oc();
					break;
				case 'magento':
					console.log( 'this is magento' );
					break;
				case 'custom':
					console.log( 'custom platform' );
					break;
			}
		},
	},
	functions: {
		_startTracking: function() {

			var
			a = qe.cookies._get('__cvx'),
			b = qe.functions._guard(),
			c = qe.component._uuid();

			if( !a || !b ) {
				qe.cookies._set( '__cvx', c, 365, '/', '' );
			}

		},
		_logs: function() {
			// Show all errors from all working functions
		},
		_idle: function() {

			// Do actions if time spent on site is grater than X

		},
		// Prevent Bots
		_guard: function() {

			var
			agent = navigator.userAgent,
			expression = "(googlebot\/|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";

			var check = new RegExp( expression, 'i' );
			if( check.test( agent ) ) {
			    return false;
			}
			return true;

		},
		// Check device type
		_device: function() {

			var
			user = qe.component._tolower( navigator.userAgent || navigator.vendor || window.opera ),
		    device = 'desktop';
			return user.match(/(ipad|galaxy|xoom|touchpad|t800)/) ? device = 'tablet' : (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(user) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(user.substr(0, 4))) && (device = 'mobile'), device;

		}
	}
},
cvx = {
	start: function() {

		// Start app
		qe.functions._startTracking();

		qe.platforms._detect();

		// Shop modules initialization
		if( qe.defaults.shop ) {
			qe.modules.msgr._moduleInit();
		}

		// qode.user = {};

	}
};
cvx.start();

var fbCartStatus = false;
window.fbMessengerPlugins = window.fbMessengerPlugins || {
	init : function() {
		FB.init({
			appId: qe.modules.msgr._appID,
			xfbml: true,
			version: qe.modules.msgr._version
		});
		FB.Event.subscribe('messenger_checkbox', function(e) {
		  // console.log(e);

		  if( e.state == 'checked' ) {
		  	fbCartStatus = true;

		  	// Nu necesita apasarea butonului add to cart
		  	if( !qe.modules.msgr._session.__status() ) {
		  		qe.cookies._set( '__cvx_fbCart', 'status=' + fbCartStatus + '&id=' + fbkRefID , 365, '/', '' );
		  	}

		  	$('<div class="messenger-voucher">Cod: <u>fashion20</u></div>').insertAfter('.messenger-holder .messenger-holder--inner p');

		  	confirmOptIn();
		  }

		  if (e.event == 'rendered') {
		    // console.log("Plugin was rendered");
		  } else if (e.event == 'checkbox') {
		    var checkboxState = e.state;
		    // console.log("Checkbox state: " + checkboxState);
		  } else if (e.event == 'not_you') {
		    // console.log("User clicked 'not you'");
		  } else if (e.event == 'hidden') {
		    // console.log("Plugin was hidden");
		  }

		});
	},
	callable : []
};

var fbkRefID;
if( qe.modules.msgr._session.__id() !== 'undefined' && qe.modules.msgr._session.__status() ) {
	fbkRefID = qe.modules.msgr._session.__id();
}
else {
	fbkRefID = "referee_" + Math.floor(Math.random() * 1000 * 60) + "_cvx=" + btoa(Math.random()).substr(5, 5);
}

window.fbMessengerPlugins.callable.push( function() {

	var fbPluginElements = document.querySelectorAll(".fb-messenger-checkbox[page_id='"+ object.fbpID +"']");
	if( fbPluginElements ) {
		for( i = 0; i < fbPluginElements.length; i++ ) {

			fbPluginElements[i].setAttribute('origin', window.location.origin);
			fbPluginElements[i].setAttribute('user_ref', fbkRefID );

			if( object.generalCheckbox == false ) {

				// -==================- data-type
				if( qode.product.type || qode.product.type != '' ) {
					fbPluginElements[i].setAttribute( 'data-type', qode.product.type );
				}
				var type = fbPluginElements[i].getAttribute('data-type');
				// -==================- end data-type

				// -==================- data-products
				var productsID, localisation, productQuery;
				if( qode.product ) {
					fbPluginElements[i].setAttribute('data-productsID', qode.product.id);
					fbPluginElements[i].setAttribute('data-localisation', qode.product.type);

					/* == TBD == cantitatea este luata automat doar cu 1 */
					fbPluginElements[i].setAttribute('data-productQuery', JSON.stringify( qode.product ));
				}
				productsID = fbPluginElements[i].getAttribute('data-productsID');
				localisation = fbPluginElements[i].getAttribute('data-localisation');
				productQuery = fbPluginElements[i].getAttribute('data-productQuery');
				// -==================- end data-products


				// fbPluginElements[i].setAttribute('blabla', qode.product.id );
				// fbPluginElements[i].setAttribute('image', encodeURI(qode.product.image) );
				// fbPluginElements[i].setAttribute('name', 'Cube Box - Trandafiri rosii - cutie alba' );

				// -==================- end data-targets

				var platformID = qode.facebook.ID;
				var email = '';
				var phone = '';
				var name = '';

				var distincts = '__distinct=' + qe.component._distinct.__get().name + '__distinctTime=' + qe.component._distinct.__get().time;

				ref_constructor = 'type=' + type + '__productsID=' + productsID + '__productQuery=' + productQuery + distincts;
			}

			// Adauga checkbox general fara a luat datele din produs
			if( object.generalCheckbox == true ) {
				ref_constructor = qe.cookies._get('__cvx');
			}

			// console.log(ref_constructor);

			window.confirmOptIn = function() {
				FB.AppEvents.logEvent('MessengerCheckboxUserConfirmation', null, {
					app_id: qe.modules.msgr._appID,
					page_id: object.fbpID,
					ref: ref_constructor,
					user_ref: fbkRefID
				});
			};
		}
	}
});
window.fbAsyncInit = window.fbAsyncInit || function() {
	window.fbMessengerPlugins.callable.forEach( function( item ) {
		item();
	});
	window.fbMessengerPlugins.init();
};

if( qode.facebook.status == true ) {

	setTimeout( function() {
		(function(d, s, id){ var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {
			return;
		}
		js = d.createElement(s); js.id = id; js.src = "https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js"; fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'facebook-jssdk'));

		$('<div class="messenger-holder" data-text="Bifeaza casuta de mai jos si noi avem grija sa iti trimitem oferte de nerefuzat!"><div class="fb-messenger-checkbox" page_id='+ object.fbpID +' messenger_app_id='+ qe.modules.msgr._appID +' allow_login="true" size="xlarge" skin="light" center_align="true"></div></div>').insertBefore( object.platform.product.add_to_cart_btn );

		// If __fbcart cookie doesn't exist, we need to call messegner checkbox
		// if( qe.modules.msgr._session.__status() != true ) {
		// 	$('<div class="messenger-holder"><div class="messenger-holder-close"><i class="fa fa-times"></i></div><div class="messenger-holder--trigger" id="mess_trigger"><i class="fa fa-bell"></i></div><div class="messenger-holder--inner"><h3>Cod de reducere <br>pentru tine!</h3><p><strong>Click pe casuta de mai jos si afla <br> &nbsp; codul de reducere!</strong></p><div class="fb-messenger-checkbox" center_align="false" page_id='+ object.fbpID +' messenger_app_id='+ qe.modules.msgr._appID +' allow_login="true" size="xlarge" skin="light" center_align="true"></div></div></div>').appendTo('body');
		// 	$("<style>.messenger-holder {-webkit-transition: all .3s;-moz-transition: all .3s;-o-transition: all .3s;transition: all .3s;-webkit-transform: translateX(100%);-ms-transform: translateX(100%);-o-transform: translateX(100%);transform: translateX(100%);position: fixed;top: 100px;right: 0;padding: 40px;z-index: 1001;max-width: 400px;background: #fff;-webkit-box-shadow: 0 0 20px rgba(0,0,0,0.2);box-shadow: 0 0 20px rgba(0,0,0,0.2);}.messenger-holder:after {display: block;content: '';position: absolute;top: 0;left: 0;width: 100%;height: 100%;background: url('http://edition.ro/fgo/messenger_popup.jpg') no-repeat top;z-index: -1;opacity: 0.5;}.messenger-holder--trigger {cursor:pointer;position: absolute;top: 50%;left: -60px;width: 50px;height: 50px;background: #fff;color: #E4583F;font-size: 22px;-webkit-border-radius: 100%;-moz-border-radius: 100%;border-radius: 100%;-webkit-transform: translateY(-50%);-ms-transform: translateY(-50%);-o-transform: translateY(-50%);transform: translateY(-50%);display: -webkit-flex;display: -moz-flex;display: -ms-flex;display: -o-flex;display: flex;-ms-align-items: center;align-items: center;justify-content: center;-webkit-box-shadow: 0 10px 10px rgba( 237, 144, 128, 0.3);box-shadow: 0 10px 10px rgba( 237, 144, 128, 0.3);}.messenger-holder--trigger:after {display: block;content: '2';position: absolute;top: 0;right: 0;color: #fff;text-align: center;font-size: 10px;line-height: 15px;width: 15px;height: 15px;background: #E4583F;-webkit-border-radius: 100%;-moz-border-radius: 100%;border-radius: 100%;}.messenger-holder p{color: #fff;background: #000;display:inline;padding:5px;line-height:34px;}.messenger-voucher{ margin-top:10px; border: 2px dashed #000;text-align: center;font-size: 20px;font-weight: bold;padding: 20px;color: #000;border-radius: 10px;}.messenger-holder-close{ position: absolute;top: 20px;right: 30px;cursor: pointer;font-size: 20px;color: #bbb;}.messenger-holder.active{-webkit-transform: none;-ms-transform: none;-o-transform: none;transform: none;}.messenger-holder .fb-messenger-checkbox{display:inline-block;border-radius:10px;margin-top:10px;background:rgba(255,255,255,0.8)}@media screen and (max-width: 490px) {.messenger-holder{max-width:100%}}</style>").appendTo('body');
		// 	$("<script>$('.messenger-holder--trigger').on('click', function() { $('.messenger-holder').addClass('active') });$('.messenger-holder-close').on('click', function() { $('.messenger-holder').removeClass('active') });</script>").appendTo('body');
		// }

	}, 0);

	qe.modules.msgr._apiActions.__addToCart();

}

class Router{
	constructor(args){
		this.args = args
		if(typeof args !== "object"){
			throw new Error(`Expected an object but found ${typeof args}`)
		}
	}


	urlMapper(name_url, params){
		// sythesises the url given, by name or link

		var _routes = this.args.routes
		let link = ""
		let modified_link = ""

		if (typeof name_url === "string"){
			// match names or urls first
			var route_obj = _routes.filter(el=> el.name == name_url || el.url == name_url) 
			if(route_obj.length > 0){
				route_obj = route_obj[0]
				
				if(!route_obj){
					throw new Error(`No matching url or url name, provided is '${name_url}'`)
				}else if(name_url ==route_obj.name){
					let link = route_obj.link
				}else if(name_url == route_obj.link){
					let link = name_url
				}else{
					throw new Error(`No matching url or url name, provided is ${name_url}`)
				}

				 modified_link = this.replaceParams(link, params)

				return {
					route: route_obj,
					modified_link: modified_link,
					args: this.args,
					params: params,
				}
			}

		}
		else{
			throw new TypeError(`Either a path url of type string is expected, found ${typeof link}`)
		}
	}


	// replaces all params in a link with the equavalent data
	replaceParams(link, params){
		// given url = "index/:slug/posts"
		let subs = link.split("/") // === ["index", ":slug", "posts"]
		subs.forEach(el =>{

			if(el.indexOf(":") == 0){
				Object.keys(params).filter(ky => {
					if(ky === el.substr(1)){
						subs.splice(subs.indexOf(el), 1, params[ky])
					}
				})
			}
		})

		var unsorted = ""
		var sorted = ""
		for(let x in subs){
			unsorted = subs.toString()
			sorted =unsorted.split(",").join("/")
		}
		return sorted
	}

	back(){
		let numberOfEntries = window.history.length
		if (numberOfEntries > 0){
			window.history.back()
		}else{
			refresh()
		}
	}

	forth(){
		let numberOfEntries = window.history.length
		if (numberOfEntries > 0){
			window.history.forward()
		}else{
			refresh()
		}
	}


	refresh(){
		window.history.go(0)
	}


	push(obj){
		if(this.args.type === "history"){
			history.pushState(obj.modified_link)
		}
	}

}






// create the element
const elem = class extends HTMLElement{
	static get observedAttributes() { 
		return ['data'];
	}

	constructor(){
		super();

		this.addEventListener("click", function () {
			var router = new Router()
			// stopped here, trying to finally test!!!
		})
	}

	connectedCallback() {
		/*
			sets the display text to whatever is provided 
			in title otherwise sets it to innerText of element
			*/
			return this.innerText = !this.innerText  || this.hasAttribute("title")? this.innerText = this.attributes.title.value : this.innerText
		}
	}








// run the internal class
customElements.define('jet-router', elem)

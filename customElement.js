class Router {
    constructor(args) {
        this.args = args
        if (typeof args !== "object") {
            throw new Error(`Expected an object but found ${typeof args}`)
        }
    }


    urlMapper(name_url, params = {}) {
        // sythesises the url given, by name or link

        var _routes = this.args.routes
        let link = ""
        let modified_link = ""

        if (typeof name_url === "string") {
            // match names or urls first
            var route_obj = _routes.filter(el => el.name == name_url || el.url == name_url)
            if (route_obj.length > 0) {
                route_obj = route_obj[0]
                console.log(route_obj)
                if (name_url === route_obj.name) {
                    link = route_obj.link
                } else if (name_url === route_obj.url) {
                    link = route_obj.link
                } else {
                    throw new Error(`No matching url or url name, provided is ${name_url}`)
                }


                route_obj.props ? normal = false : normal = true


                modified_link = this.replaceParams(link, normal, params)

                return {
                    route: route_obj,
                    modified_link: modified_link,
                    args: this.args,
                    params: params,
                }
            }

        } else {
            throw new TypeError(`A path url or name of type string is expected, found ${typeof link}`)
        }
    }


    // replaces all params in a link with the equavalent data
    replaceParams(link, normal, params) {
        var sorted = ""
        if (normal) {
            sorted = link
        } else {
            // given url = "index/:slug/posts"
            let subs = link.split("/") // === ["index", ":slug", "posts"]
            subs.forEach(el => {

                if (el.indexOf(":") == 0) {
                    if (params) {
                        Object.keys(params).filter(ky => {
                            if (ky === el.substr(1)) {
                                subs.splice(subs.indexOf(el), 1, params[ky])
                            }
                        })
                    } else {
                        throw new EvalError("This route expects params")
                    }

                }
            })

            var unsorted = ""

            for (let x in subs) {
                unsorted = subs.toString()
                sorted = unsorted.split(",").join("/")
            }
        }

        return sorted
    }

    back() {
        let numberOfEntries = window.history.length
        if (numberOfEntries > 0) {
            window.history.back()
        } else {
            refresh()
        }
    }

    forth() {
        let numberOfEntries = window.history.length
        if (numberOfEntries > 0) {
            window.history.forward()
        } else {
            refresh()
        }
    }


    refresh() {
        window.history.go(0)
    }


    push(obj) {
        if (this.args.type === "history") {
            history.pushState(obj.modified_link)
        }
    }

}




class RouterInit {
    constructor(args) {
        this.args = args
        this.createElement(args)
    }


    element(args) {
        this.args = args
        class elem extends HTMLElement {
            constructor() {
                super();
                let router = new Router(args)
                this.addEventListener("click", function() {
                    let name_url, params;
                    if (this.getAttribute("where")) {
                        name_url = this.getAttribute("where")
                    } else if (this.getAttribute("name")) {
                        name_url = this.getAttribute("name")
                    }

                    if (this.getAttribute("params") && this.getAttribute("params") == "") {
                        params = new Object(this.getAttribute("params"))
                        console.log(params)

                    } else {
                        params = null
                    }

                    let new_route_obj = router.urlMapper(name_url, params)
                    if (new_route_obj.args.type === "history") {
                        window.history.pushState(new_route_obj, )
                    }

                })
            }

            connectedCallback() {
                /*
                	sets the display text to whatever is provided 
                	in title otherwise sets it to innerText of element
                	*/
                return this.innerText = !this.innerText || this.hasAttribute("title") ? this.innerText = this.attributes.title.value : this.innerText
            }
        }

        return customElements.define('jet-router', elem)
    }

    // create the element


    // run the internal class
    createElement = (args) => this.element(args)


}
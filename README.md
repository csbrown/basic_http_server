Class ~50m

* Log in to Google Cloud

    * Set up VM instance
        
        * (While waiting:)
            * Talk about free tier https://cloud.google.com/free/
            * Talk about free credits
            * Talk about other free products: AWS, Oracle Cloud, Azure, Heroku
            * Talk about local hosting
                * freedns.afraid.org
                * inadyn

        * Enable HTTP + HTTPS (ports 80 + 443)
            * ping the machine from your local host
        * Go to metadata section, and add your public ssh key (if on windows, I suggest git bash: https://dev.to/bsara/how-to-setup-ssh-authentication-for-git-bash-on-windows-a63)
            * ssh into the machine from local host
            * $ sudo python3 -m http.server 80
            
            * We have a basic http server!
                * this just serves up static files.....
                * Suggest getting an https cert for sensitive applications! https://www.ssls.com/ssl-certificates/comodo-positivessl

            * What is the difference between this and a real web stack?
                * nginx/apache/iis
                    * ![](web_server_market.png){ width=50% }
                    * nginx and apache run on windows...
                * a normal web stack has multiple layers to deal with various types of requests
                    * reverse proxy, load balancer, web server, custom scripts that take in web requests and output text (usually html, json) (CGI, etc)
                    * request comes in on port 80 and the byte stream is read and the destination interpreted by reverse proxy
                        * if nginx can fulfill the request easily (cached requests and local static files) it does so
                            * this may differ depending on your stack!
                        * else, it forwards the request (optional: to the load balancer, that forwards the request) to the appropriate server
                        * often deals with some security stuff as well (e.g. IP-based buffering to prevent DoS)
                        * ![](reverse-proxy-flow.svg){ width=50% }
                    * server gets request on whatever port reverse proxy sends it through
                        1. serve up static files
                        2. delegate to custom scripts (and possibly deal with local load-balancing)
                    * custom scripts:
                        1. take in web request
                        2. build a response based on web request info (e.g. user login info, or get-request params)
                        3. hand the response back to the server, back to the reverse proxy, back to the client
                   
            * This is a lot of stuff to deal with!
                * This can all get crazy complicated to deploy at scale
                * Fortunately, we don't need to deploy at scale right now
                    * However, if you are creating an app that you (or someone else) intends to use in future (at scale), you may want
                      to create a research task in order to set this up to scale from the beginning.
                    * https://servebolt.com/articles/calculate-how-many-simultaneous-website-visitors/
                    * A single core can handle from several to several dozen requests per second (depending on how heavy your response is)

            * Let's set up a basic web server:
                
                * Imma use docker b/c docker is awesome
                    * Build once - deploy many times
                    * Self-documenting IT process!
                    * Install docker: https://docs.docker.com/engine/install/debian
                        * 

                            ```
                            $ sudo apt-get remove docker docker-engine docker.io containerd runc
                            $ sudo apt-get update
                            $ sudo apt-get install \
                              apt-transport-https \
                              ca-certificates \
                              curl \
                              gnupg-agent \
                              software-properties-common
                            $ curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
                            $ sudo add-apt-repository \
                              "deb [arch=amd64] https://download.docker.com/linux/debian \
                              $(lsb_release -cs) \
                              stable"
                            $ sudo apt-get update
                            $ sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose 
                            ```
                    * git clone my basic_http_server repo: https://github.com/csbrown/basic_http_server
                        * go over the various parts:
                            * briefly: my_app (super basic flask app)
                                * can use php as well, or whatever other web framework (but windows will be different....)
                            * Dockerfile (install the stuff to run our single-server web app)
                            * nginx.conf (tell nginx how to forward requests) (note the "http://flask", (localhost is NOT localhost!))
                            * docker-compose (chat about how the network stuff works)
                        * docker-compose up
                          

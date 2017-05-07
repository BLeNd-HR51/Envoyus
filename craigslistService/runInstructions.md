[ brew update ] - Update all installed homebrew formula

[ which xcode-select ] - Check if you've installed xcode-select or not. If it is installed, terminal will print something like [ /usr/bin/xcode-select ]. Otherwise, nothing will return and you have to run [ xcode-select --install ]. Wait for it to finish installing before proceed to the next step.

[ brew install python3 ] - Install the latest version of python 3. Python has two versions (2 and 3) concurrently. Version 2.7 is installed on the Mac by default. Version 3 is the latest and everyone is shifting away from version 2.

[  pip3 install Scrapy ] - Install Scrapy into your machine.

To run the "spider", use the following syntax

[ scrapy crawl <spider name> -o <file to be save name>.json ]

So, for querying San Francisco, you could

[ scrapy crawl cityoncraigslist -o sanfrancisco.json ]

Or for specific searches like for 'macbook pro' in the bronx newyork, you could use

[ scrapy crawl clquerywithargsnouserinfo -a search_area=newyork -a search_query=macbook+pro -o newScrapeData/mbp-nyc.json ]

With the following parts:

- [ scrapy crawl ] is the base command
- [ clquerywithargsnouserinfo ] is the name of the spyder you want to use
- [ -a search_area=newyork ] is the search area argument proceeded by the -a (argument flag)
- [ -a search_subarea=brx ] is the search subarea argument proceeded by the -a (argument flag)
- [ -a search_query=macbook+pro ] is the search query argument (+ = spaces) proceeded by the -a (argument flag)
- [ -o newScrapeData/mbp-nyc.json ] is the file path & name to save the output to proceeded by the -o (option flag)

see [Areas and Subareas](https://github.com/BLeNd-HR51/Envoyus/blob/master/craigslistService/areasAndSubareas.json)

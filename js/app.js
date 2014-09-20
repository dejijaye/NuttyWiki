var wikiSearch = {

	//base url for wikipedia and google books api respectively
	wbase: "http://en.wikipedia.org/w/api.php?",
	gbase: "https://www.googleapis.com/books/v1/volumes",

	//parameter required by the google books api
	params: {q: "", orderBy: "newest"},


	// method that performs all the other actions
	init: function ()
	{
		wikiSearch.getEntry();
	},


	//method to get the entry from the textbox
	getEntry: function () 
	{
		$("#searchbtn").click(wikiSearch.validate);
		
	},

	//method to validate the entry from the textbox
	validate: function ()
	{
		var entry = $("#searchbar").val();

		if(entry)
		{
			entry = entry.trim();
			if(entry.length > 1)
			{
				$("#article").empty();
				$(".jTscroller").empty();
				$(".spinner").show();
				$(".spinner1").show();	
				$("#warning").hide();
				$("#entry").hide();
				wikiSearch.searchEntry(entry);
				wikiSearch.searchBooks(entry);
				return;
			}
		}
		$("#warning").text("Please enter a valid search query");
	},


	//method that perfoms the search from wikipedia
	searchEntry: function (entry)
	{
		$.getJSON(wikiSearch.wbase+"action=parse&format=json&prop=text&section=0&page=" + entry + "&redirects&callback=?", function(data)
		{
			console.log(data);
			if (!data.error)
			{
				var markup = data.parse.text["*"];
				if (typeof markup !== "undefined")
				{
					$("#entry").text(entry).show();
					var blurb = $('<div id="articleText"></div>').html(markup);
	 
		            // remove links as they will not work
		            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
		 
		            // remove any references
		            blurb.find('sup').remove();
		 
		            // remove cite error
		            blurb.find('.mw-ext-cite-error').remove();
		            $('#article').html($(blurb).find('p'));
					// console.log(markup);
				}
			}
			else
			{
				$("#warning").text(data.error.info).show();
			}
			$(".spinner").hide();
		});
		$("#article").show();
	},
 

 	//method that performs the search from google books
	searchBooks: function(bookname) 
	{
		wikiSearch.params.q = bookname;
		$.getJSON(wikiSearch.gbase, wikiSearch.params, function (response) 
		{
			console.log(response);

			wikiSearch.loadBooks(response);
		} )
	},


	//method that loads the books into the html page
	loadBooks: function (response) 
	{
		if (response.totalItems < 1)
		{
		console.log("No Result");			
			// $("#bookDisplay").append('<h1>'+ "No Result Found" + '</h1>');
		}

		$.each(response.items, function ()
		{
			console.log(this.volumeInfo.authors);
			var title = this.volumeInfo.title;
			var author = this.volumeInfo.authors;
			var image_url = this.volumeInfo.imageLinks.thumbnail;
			var bookID = this.id;

			if (typeof ratings === 'undefined')
			{
				var ratings = "Not Available";
			}
			var postDiv = '<a href="#"><img src="' + image_url +'"/></a>';
			$(".jTscroller").append(postDiv);
			$(".spinner1").hide();
		})	
	},
}

$(document).ready( function(){
	wikiSearch.init()
});

$(document).bind('keypress', function(e) {
    if(e.keyCode==13){
         $('#searchbtn').trigger('click');
     }
});

	
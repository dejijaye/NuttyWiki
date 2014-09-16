var wikiSearch = {
	
	base: "http://en.wikipedia.org/w/api.php?",


	init: function ()
	{
		wikiSearch.getEntry();
	},
	
	getEntry: function () 
	{
		$("#searchbtn").click(wikiSearch.validate);

	},

	validate: function ()
	{
		var entry = $("#searchbar").val();

		if(entry)
		{
			entry = entry.trim();
			if(entry.length > 1)
			{
				wikiSearch.searchEntry(entry);
				$("#warning").hide();
				return;
			}
		}
		$("#warning").text("Please enter a valid search query");
	},

	searchEntry: function (entry)
	{
		$.getJSON(wikiSearch.base+"action=parse&format=json&prop=text&section=0&page=" + entry + "&callback=?", function(data)
		{
			// console.log(data);
			var markup = data.parse.text["*"];
			var blurb = $('<div></div>').html(markup);
 
            // remove links as they will not work
            blurb.find('a').each(function() { $(this).replaceWith($(this).html()); });
 
            // remove any references
            blurb.find('sup').remove();
 
            // remove cite error
            blurb.find('.mw-ext-cite-error').remove();
            $('#article').html($(blurb).find('p'));
			// console.log(markup);
		})
	}
}

$(document).ready(wikiSearch.init);
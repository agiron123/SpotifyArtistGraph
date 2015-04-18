/**
 * Created by andre on 4/17/15.
 */

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "ready!" );

// create an array with nodes
var nodes = new vis.DataSet();
var edges = new vis.DataSet();
// create an array with edges

// create a network
var container = document.getElementById('visualization');
var data = {
    nodes: nodes,
    edges: edges
};

function onSelect (properties) {
    //alert('selected nodes: ' + properties.nodes);
    var artistId = properties.nodes[0];
    fetchRelatedArtists(artistId);
}

// add event listener
var network = new vis.Network(container, data, {});
network.on('select', onSelect);

var fetchRelatedArtists = function (artistId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/artists/' + artistId + '/related-artists',
        success: function (response) {

            var relatedArtists = response;

            //resultsPlaceholder.innerHTML = template(relatedArtists);
            console.log("Length: " + relatedArtists.length);
            for(var i = 0; i < relatedArtists.artists.length; i++)
            {
                console.log(relatedArtists.artists[i].name);
                console.log(relatedArtists.artists[i].id);
                var artistedge = {id: relatedArtists.artists[i].id, label: relatedArtists.artists[i].name};
                var name = artistedge.label;

                if(nodes.get(artistedge.id) == null){
                    nodes.add(artistedge);
                    edges.add({from: artistId, to: artistedge.id});
                }
            }

            network.redraw();
            //callback(response);
        }
    });
};

var searchArtist = function (query, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'artist'
        },
        success: function (response) {
            var item = response.artists.items[0];
            var parent = {id: item.id, label: item.name };
            nodes.add(parent);
            //callback(item.id, item.name);
        }
    });
};

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var artistName = document.getElementById('query').value;
    searchArtist(artistName, function(){});

    /*
    searchArtist(artistName, function(id, foundName) {
        var parent = {id: id, label: foundName };
        nodes.add(parent);

        //nodes.onclick

        fetchRelatedArtists(id, function(relatedArtists) {

            relatedArtists.artistName = foundName;

            //resultsPlaceholder.innerHTML = template(relatedArtists);
            console.log("Length: " + relatedArtists.length);
            for(var i = 0; i < relatedArtists.artists.length; i++)
            {
                console.log(relatedArtists.artists[i].name);
                console.log(relatedArtists.artists[i].id);
                var artistedge = {id: relatedArtists.artists[i].id, label: relatedArtists.artists[i].name};
                var name = artistedge.label;
                artistedge.addEventListener("select", searchArtist(name),function(){});
                nodes.add(artistedge);
                edges.add({from: parent.id, to: artistedge.id});
            }

            network.redraw();
        }); */

    },false);

});
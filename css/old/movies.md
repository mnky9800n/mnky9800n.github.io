---
layout: page
title: movies
category: movies
---

I decided that I was going to watch all of the movies on the [imdb top 250 movie list](https://www.imdb.com/search/title?groups=top_250&sort=user_rating) and then write something here about them. Don't get too excited about that.

As a note, I'm only watching a) what I haven't seen before, and b) what is available on netflix. So there isn't any special order to any of it.

Also, I subscribe to [auteur theory](https://en.wikipedia.org/wiki/Auteur) so all of my writings will be grounded in that. I recognize that film making is a collaborative process and that there are other views to be had.

<ul>
  {% for post in site.categories.movies %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
<!-- 
{% for category in site.categories %}
  <h3>{{ category[0] }}</h3>
  <ul>
    {% for post in category[1] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}  -->
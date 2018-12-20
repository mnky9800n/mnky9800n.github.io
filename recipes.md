---
layout: page
title: recipes
---

I like to cook and I like making things from scratch and coming up with ideas. They probably aren't terribly original, but they are cataloged here.

I promise I will never tell some dumb fuck story that you have to scroll through to read about whatever the recipe is I made that you want.

I'm a big fan of [The Joy of Cooking](https://www.amazon.com/Joy-of-Cooking/dp/0743246268). This is where most of my ideas come from.


<ul>
  {% for post in site.categories.recipes %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
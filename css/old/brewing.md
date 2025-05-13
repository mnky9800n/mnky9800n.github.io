---
layout: page
title: brewing
permalink: /brewing/
---

I've begun to brew beer with my friends. Mostly this means I watch them brew so my contributions have been more managerial. That is, advertising. So all the advertisements now live here. I'll post recipes one day.

<ul>
  {% for post in site.categories.beers %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
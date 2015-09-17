<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
</head>

#  Non-obvious - a reflection tool

This is a tool prototype for reflecting on subjects that you already have some knowledge and understanding.

*   demo site: [http://layers.aalto.fi/Non-obvious](http://layers.aalto.fi/Non-obvious)
*   source code: [http://sourceforge.net/projects/learning-layers/](http://sourceforge.net/projects/learning-layers/)
*   this [_readme.html](_readme.html) | [readme.md](readme.md)

[TOC]

## Licence

```
Copyright 2013–2015 Jukka Purma

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

##  Using Non-obvious 

'Non-obvious' helps you to think about a theme or issue in a productive manner: your thinking produces results for later use and the process is guided to go deeper in the issue. This guidance or scaffolding is done by forcing the thoughts into short notes around your own defined _theme_.

Each _theme_ has various amount of _obvious_ features: observations, memories and aspects that pop out automatically or with ease. Often these feel unnecessary to be written down, but these are also starting points for further reflections, so an obvious feature should at least be named. Since obvious features are obvious to you, they don't need further description.

The next steps from _obvious_ aspects are _reflections_, anything that is non-obvious and related to the overall theme and its obvious aspect.

The reflections can be followed with further reflections, where each can take a different view on the previous reflection or work out the consequences of previous statement. There may be need to add more obvious statements to work as a reference points in chain of reflection, and the chains can diverge. Also the overall theme may be readjusted if the reflection seems to be going to an interesting new direction.

By keeping reflections under the chosen theme and by keeping obvious observations separated, the process of reflection can stay directed and focused on non-trivial and interesting parts. 

The reflections are currently automatically stored in the web browser's local database, so they are private and cannot be co-created. They can be exported as a data to be imported to another browser, or they can exported as a plain text to be used in other documents.

New notes are automatically added when enter is pressed. If you want to have line breaks within one note, press Shift-Enter. You can use arrow keys to move between notes. Reflection elements can be reorganized by dragging and dropping them. 

A reflection may have a background image selected for it, at current version these are chosen within a set of given images. The color theme for reflections is automatically calculated based on image, which helps to create a harmonous reflection environment.

In the bottom of the screen there are buttons to copy current reflection or all reflections to clipboard for further use (↧ save), or to import reflections from another browser (↥ upload). Next to them there are buttons to switch to previous page of reflections ( < ) or to next page ( > ) or to create a new page of reflections ( + ).

The environment has two example reflections. You can remove or edit them freely, changing them won't affect the originals.

###  Buttons and screen elements 

In theme, when focused

*   images/xxx.jpg ↻  : rotate between alternative background images.
*   ↘+ : add obvious feature (shortcut: enter)
*    x : remove this page of reflections.

In obvious / reflection / adjusted theme, when focused

*  type ↻ : rotate between different types of notes.
*  ↘+ : add a new child note. If current note is 'obvious' or 'reflection', the new note will be a reflection. If current note is 'adjusted theme', the new note will be 'obvious'   (shortcut: enter)
*   ↓+ : add a new sibling note. This adds a new note of the same level as the current note.
*   x : remove this note.

Bottom row buttons:

*   ↧ save :
	*   json : Shows the json source code for current page of reflections. This is a technical feature to help connecting the tool to some server backend. Also because the reflections are now kept in browser's own database, moving one reflection page to another browser needs to copy and paste the data between the browsers.
	*   plain text : Gives a human readable 'export' of the reflection.
	*   all data : Displays json data of all of the reflections in this browser's database. This can be uploaded to other browser, or saved as a local backup. (making a local backup of important reflections is recommended, because the software is under construction and previous data may get resetted with updates.)
*   ↥ upload : Here you can paste a JSON string saved from another instance of Non-obvious (from another browser, or from another user). Depending if string is describing one reflection page or set of pages, this string will replace current page or all of reflection pages.
*   < : Previous page of reflections
*   \> : Next page of reflections
*   \+ : Add a new page of reflections
*   Info : Show this page.

##  Installing and running your own Non-obvious -instance

Non-obvious doesn't do any server-side processing. You can just download the code and open _index.html_ in a web browser. The benefit for running your own page is that you can use your own background images and you don't need to worry about losing your reflections because of changes in layers/Non-obvious.

However, palette detection from images has some same-origin limitations that require a) using Firefox, which has more lax limitations when running html from file system or b) running pages through a webserver. The option (b) doesn't require pages to be publicly accessible, it is enough to run them in localhost. Eg. in mac, put the Non-obvious -folder to userpath/Sites -folder and google how to enable your system-provided Apache web server. Then go to http://localhost/~yourusername/Non-obvious 

Updating readme (requires Python & Python-Markdown -library installed) : 
	python -m markdown -x toc -x def_list -x footnotes -o html4 readme.md > _readme.html 

##  Theoretical background

Non-obvious is originally to test a theoretical model of reflection. Since John Dewey's _How we Think_[^Dewey1910] there have been psychological or pedagogical descriptions and definitions that distinguish reflective thought from common everyday thought and habitual activities. For Dewey, reflective thinking was deliberate, learned process to evaluate evidence for beliefs. In 1980's reflection returned to educational vocabulary as a method for learning from experience [^Boud1985]. This definition was especially useful for adult learners and learning at work, where the aims of learning are often related to work activities and work performance. Reflective practices are typically implemented as private or collaborate sessions of looking back at experience, analyzing it and formulating changes for the future situations[^MIRROR1.4].

Another formulation for reflection is reflection-in-action [^Schon1983], where reflection happens during the work as a conscious exploration of alternative solutions and limits of work methods. Here the emphasis is on novice professionals, who have to make conscious decisions of applying their knowledge, and with experts, who can do most of the work by rote action, and have cognitive capacity freed to consciously explore limits of their skills. Schön's description of reflective practitioneers is often used to argue for adding reflective practices, but the reflective practices implemented are more often about looking back at experiences (reflection-on-action) than reflecting during them (reflection-in-action).

'Non-obvious' reflection model tries to capture Dewey's formulation of reflection as conscious, rigorous thought on a theme, with no limitations on what the theme is. Reflection doesn't need to be limited to past experiences or experiences, there are reflections about art, nature, scientific theories and future plans that do not target experiences.

'Non-obvious' also separates reflection from rote thinking and rote performance by distinguishing obvious, primary, or automated aspects of a reflected theme and second-order, derived, or reflected features of a theme. The difference between obvious aspect and derived aspect are personal, but real: there are features or properties that come to mind automatically when a concept, e.g. 'python' is activated, but these vary between people and are based on experience. In cognitive psychology these are called prototype features. For 'non-obvious' model of reflection, acting solely upon obvious, or primary features is non-reflective action. Reflection begins when these obvious features are taken as objects of thought together with the current overall theme.

The results of thinking about obvious features of a theme are reflections, and them can become the next objects of thought. Dewey makes a distinction of reflection and idle wandering of thoughts, or daydreaming. The distinction is here captured by maintaining a connection between original theme and further reflections. If reflections are still about theme, the process is reflection, if not, it is wandering thought. The elements are captured in Figure 1.

<center>
<img src="images/reflection.svg" width="480" title="Figure 1. Elements of reflection"/>

Figure 1. Elements of reflection.
</center>

In figure 1 solid lines form the loop of rote thinking, and dotted lines are the second loop of reflective thinking. In rote thinking a given theme triggers 'requests' from concept source. Concept source is an abstraction of systems that can form or restore concepts, including memory and perception. Concept source responds with some automated obvious features or aspects of theme: this is the deduction or induction that is automatic. The result is also validated automatically it is recognized in relation to theme. To take an example, I am washing a plate and turn the faucet on. The water is steaming and I turn the faucet to bit colder before putting my hands in. This is all within rote thinking loop, the theme is washing a plate and all of the steps are automated responses to ongoing, varying state of the theme. At first, the automated response to theme is to turn the faucet on. When the faucet is on, and the water is steaming, the automated response to this state is to turn it colder, and so on.
We engage in reflection when obvious features, or automated responses, are recognized and analyzed as sources for further conscious thoughts. Reflections in turn can use previous reflections as their sources. Reflections need to be validated with the theme, and reflections can update the theme: platewashing example can turn to reflection about how much more water I tend use when washing singular dishes than when waiting for dishes to pile up.

### Levels of reflection 

Many models of reflection assume different levels of reflection. Like learning itself, reflection without further qualifiers is a very general cognitive process, too general for planning educational activities to reach educational goals. With additional classifications, it would be  possible to suggest certain type of reflection to reach certain kind of educational goals. 

Reflections can be categorized on three basis. There can be 1) a difference in themes or subject matters that are reflected about, 2) a difference in process of reflection or 3) difference in results of reflection. In research there seems to be confusion where theories that assume type (2) process differences justify their categorization with questionnaires that point at type (3) differences. Following are examples of questions of questionnaire in Kember et al.[^Kember2000]:
<pre><code>
Reflection
  3. I sometimes question the way others do something and try to think of a better way.
  7. I like to think over what I have been doing and consider alternative ways of doing it.
  11. I often reflect on my actions to see whether I could have improved on what I did.
  15. I often re-appraise my experience so I can learn from it and improve for my next performance.
Critical Reflection
  4. As a result of this course I have changed the way I look at myself.
  8. This course has challenged some of my firmly held ideas.
  12. As a result of this course I have changed my normal way of doing things.
  16. During this course I discovered faults in what I had previously believed to be right.
</code></pre>
Here are four strongest factoring questions for categories of reflection and Intensive reflection in Peltier et al[^Peltier2005].
<pre><code>
Reflection
  I often reappraised my learning so I could learn from them.
  I often reflected on my actions to see whether I could improve them.
  I often tried to think about how I could do something better next time.
  I liked to think about my actions to find alternative ways of doing them.
Intensive reflection
  What I learned made me rethink my assumptions about business.
  I learned many new things about myself.
  As a result of this program I have changed the way that I normally do things. 
  As a result of this program I have changed the way that I look at myself. 
</code></pre>
It seems that the difference between reflection and intensive/critical reflection is difference of reflections with successful results and mere attempts of reflections. There is no process difference to be found between categories. In both the categories end up defined circularly in relation to their use to achieve goals: 'Critical reflection is good to raise critical awareness and critical reflection is recognized as any reflection that has raised critical awareness.'

In Non-obvious model of reflection I am proposing that typologies of reflections should be based on (1), themes of reflection and there is no hierarchy or difference of depth between different possible themes. Some level models[^Grossman2009][^Fleck2010] state highest or deepest level of reflection to be those that reflect certain themes, like professional image or social structures. These kind of levels would need an epistemology to support them where the themes really are the deepest knowledge. The reflection levels are usually created in context of some educational program, and within such there may be that e.g. content reflection is 'closer' to everyday activities than reflections about future professional habitus. 

[^Dewey1910]: Dewey, J.: How we think. DC Heath (Boston, USA) (1910)
[^Boud1985]: Boud, D., Keogh, R., Walker, D.: Promoting reflection in learning: A model. In: Boud, D., Keogh, R., Walker, D. (eds.) Reflection: Turning experience into learning, pp. 18-40. Kogan Page Ltd: London (1985)
[^MIRROR1.4]: Krogstie, B.R.: D1.4 model of computer supported reflective learning. Tech. rep., The Mirror Project (2012)
[^Schon1983]: Schön, D.A.: The reflective practitioner: How professionals think in action. Basic books (1983)
[^Kember2000]: Kember, D., Leung, D.Y., Jones, A., Loke, A.Y., McKay, J., Sinclair, K., Tse, H., Webb, C., Yuet Wong, F.K., Wong, M., et al.: Development of a questionnaire to measure the level of reflective thinking. Assessment & evaluation in higher education 25(4), 381–395 (2000)
[^Peltier2005]: Peltier, J.W., Hay, A., Drago, W.: The reflective learning continuum: Reflecting on reflection. Journal of Marketing Education 27(3), 250-263 (2005)
[^Grossman2009]: Grossman, R.: Structures for facilitating student reflection. College Teaching 57(1), 15-22 (2009)
[^Reynolds1998]: Reynolds, M.: Reflection and critical reflection in management learning. Management learning 29(2), 183-200 (1998).
[^Fleck2010]:  Fleck, R., Fitzpatrick, G.: Reflecting on reflection: framing a design landscape. In: Proceedings of the 22nd Conference of the Computer-Human Interaction Special Interest Group of Australia on Computer-Human Interaction. pp. 216-223. ACM (2010)

///Footnotes Go Here///

##  Informal pedagogical defense 

The common problem with reflective practices that they are front-heavy with description until they get to good parts of actual reflection.

Retelling experiences is not enough for reflection, but with reflective practices that use past experiences as a main source, a large part of 'reflection' work is retelling the experience to provide context for the actual reflections. With most of the reflection tools, the return to experience is the difficult, but solvable problem where the tool tries to help. The exception is  spoken, dialogic reflection, where there are common discourse conventions to guide when to stop explaining the context and when the learner should start reflecting on the meaning. With written reflection methods, the learned writing conventions emphasize setting up the context and description of events for an unknown reader, who doesn't know the context or the event. This is often made worse when the reflections are assumed to be read by teacher, so writer has to add explanations to those aspects that are obvious to writer. 

I consider this description phase to be contextual fluff and directing the effort away from the actual reflection. There are defenses for close attention to descriptions in reflection process, but in formal learning setting there are anyhow so much other description tasks that reflection should not be reduced to yet another descriptive storytelling task, with some personal growth added to it. 

In Non-obvious, the tool recognizes the necessity of some description before reflection, but devalues it by assigning it to 'obvious' category. The actual reflections are descendants of obvious observations and remarks.

## Design features

Non-obvious is designed to maintain the user's focus on the main theme. This is done by making the view memorable with strong, meaningful background images and having all user interface elements to accommodiate to the color scheme of the images. A proper tool for reflection has to make moments of inaction pleasurable, moments of staring at the screen and thinking. The purpose is to create a state of reflection similar to viewing and analysing art.

The dynamic palette that accommodiates to background image is a new design feature for web sites, especially for learning tools. (iTunes 11 and Jolla's operating system are only examples of dynamic theme creation I've seen) Other UI-elements are kept minimal, they are hidden if the note is not active and when active, they are done with minimal line weight and with simple symbols that use note's own colors. The page is beautiful while it is being worked on, and this is something that is almost never achieved with web tools.

The practice of adjusting the color theme of user interface to the user-provided content could find use in any social service that relies to and encourages user content. It is always a weak point in visual design of user interface that the balanced and calculated site design will always be overridden with user content that doesn't match or follow the designers' intentions. Keeping the design as a variable that adjusts to user content programmatically would be a logical solution to that problem, to keep the pages beautiful because of user's content, not in spite of it. 

A threaded discussion is a familiar web convention, but not usually used for personal writing.  With indentations it keeps the text blocks of reflection visually interesting and encourages short paragraphs.

Since the data is saved to local storage in browser, there is no delay with data transfer or UI response, and also no user management to go through. Collaborative editing will bring these problems, if such is required, but current goal of private reflection tool is best served by keeping also the data local. 

## Technical features

There are few technical aspects that make Non-obvious interesting as a Learning Layers prototype.

### Palette creation algorithm + dynamic stylesheet

The tool uses ColorThief-wrapper for color quantitization algorithm to pick top representative colors from canvas-laid image file. From a set of top 15 colors, there are created 5 two-color pairs, where the first color is picked from top of the representative colors and the second color is computed from the rest of the available top-15 colors, by calculating which color would have the largest difference. This best-match finding algorithm can be further tuned, e.g. now there needs to be extra penalty for matching strongly red colors with other colors: their contrast is weak for human eyes. 

The palette is used to create dynamically a new stylesheet for the page that replaces all of the color definitions in elements and their hover-states. This procedure can be isolated and used to create visual styles that adjust to the user-created content.

### Client computation + local storage + light JSON data

The data of reflections is stored in a javascript object where subobjects don't refer to each others directly, but with given keys. This makes reinstanting actual objects from JSON string straightforward and keeps JSON stringified data light. Different connectors to other backends can be made with different implementations of DataSource class. The currenct connector follows somewhat pattern for connecting to widget servers, as it tries to keep data light and relies on JSON and javascript object formats.

Current LocalStorageDataSource stores notes to browser's LocalStorage, which is an option that is available to all modern browsers and works without delay even without internet connection.

As a client/server service Non-obvious does a lot in client side. (Currently everything) However sorting and handling small amounts (<1000) notes is always a light task for modern clients and should be done client side without waiting for network responses. Saving should happen in background and the serverside computation should be sanity checks for data and checking if there are other newer versions available.

### Possibilities for semantic magic

Since the knowledge that users and learners write down to Non-obvious is categorized to theme, obvious and reflections and obvious aspects are encouraged to be short, these obvious aspects are very close to tags. If Non-obvious is connected to server, it can be used in support of other tools to collect tags about themes or about user. If there is enough user-created semantic data available, obvious features for a theme can be suggested automatically.

##  Variants and further development 

Non-obvious is not developed to answer directly to any of the four major prototype tracks of Learning Layers. It is more a result of one sidetrack, the 'reflection of work' that is often mentioned in esp. health care training. Here are few suggestions of how Non-obvious could be used in various Learning Layers tracks. 

### Front end for image tagging and annotation
Non-obvious is a variant interface for post-processing of images with laptop or tablets. The photo would go to background and notes should have a possibility to attach them with visible line to a certain point of the image.

Non-obvious's take on tagging and annotation would encourage to take some time and reflect with the photo, instead of making tagging quick and easy. This could be good direction to go in early stage of Layers tools, since it would give users immediately something useful back. If there is only quick tagging, that step doesn't serve the tagger in any way, it is just a duty, unless there is a lively existing community that benefits from those tags.

This would require connecting notes to some server where the users store their images. 

### Big screen use in for interactive exhibition
Non-obvious is currently designed to work well with quite big screens. For exhibition planned in CAPTUS, Non-obvious could be used in screens next to displayed artefacts to show professional observations and reflections on displayed theme and to give a possibility to write down own observations and reflections.

This would require making some 'locked' versions of notes and making sure that UI-elements are recognizable as clickable in big screen.

### Mobile version
Non-obvious works well with iPad mini-sized screens but not well for smaller. There would be some work to make a more mobile version: notes interaction buttons would probably go to default position in bottom or top of the screen and there should be a way to slide all notes off and on screen, since there is no room to both edit and read notes and look at the image at the same time. The use case would be image tagging and annotation.

### Reflection tool in healthcare
Healthcare has long tradition of reflection as part of learning. This could be inserted as a tool to help in some ongoing demands for reflection. Since phototaking in healthcare is problematic, the background and themes would work as a classification help. There is a certain page with immediately recognizable default background image for reflections about a certain subject area etc.

### Reflection tool and white folders in construction
UI ideas of Non-obvious could easily be used in digital white folder. Photo of day's work is the basis for white folder notes, and notes are written over it to pregiven categories. Instead of one theme per page, there could be few default questions, with less visual prominence.


## Credits

Research, design and coding: Jukka Purma, Aalto University School of Art, Design and Architecture

Color-Thief.js, which is used to pick top n colors from an image is by Lokesh Dhakar - http://www.lokeshdhakar.com, and quantize.js which is the quantization algorithm implementation in javascript that does the actual work is by Nick Rabinowitz

Thanks to Merja Bauters and Kiarii Ngua for encouragement.







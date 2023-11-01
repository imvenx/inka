prevent continue animating after last kf if there is no kf

refresh inkscape path not working properly, need to close and reopen program to actually work

establish a cd/ci pipeline

prevent exported svg grow 

add option to only record selected els

add again some kf on svg parent so massive delete/drag is easier

add search input on how to.. window

add modals on how to.. window for giff tutorials, or even better, open them in a new electron window 

add support for text element

add support for opacity

use  todo file more, put todos on readme, github issues is useless

add save last inka window size and position

add project name and thumbnail to recent projects

add mute and solo options for animate els

add logs from front end and backend on a tab on header menu

create keyframe on selected empty line with right click menu


add undo/redo <- -> functionality to revert changes (ctrl z, shift ctrl z)

projects[
    {
        projectId:'asdads'
        projectName: 'My first Project'
        filepath: "/.../...",
        duration:
        fps:
        currentTime:
        svEl:{}
        svString:''
        lastEdit: '2/2/22',
    }
]

Essential features:

- timeline shrink/expand without step dependency
- add attrs from elsList directly
- delete, edit kfs individually
- handle multiple projects
- handle multiple anims from the same project

[] - make functionality to parse lines to curves to morph properly, or other workaround
[] - edit attributes

[] - Import / export:
    [] - Load projects from directory
    [] - Save projects 
    [] - Export to SVG + CSS
    [] - Export to Giff 

[] - Add multiple animations handler for the same project

[] - Use css to replace svg attributes like x, y, height, width, path, etc

[x] - TODO IMPORTANT: Get model like is on els list right now but on store and send to both elsList and to kfViewer.

[] - Store the last state of the svg element to compare with the updated svg and get the attributes
that should be animated in order to only animate them instead of creating kf for all attrs

[] - Add button to record or stop recording kfs, and remove the create kf button maybe.

[] - When creating a keyframe if is not on second zero and zero has not kf val, then set a default value on zero (the value to set on zero should be the last state)

[] - Convert stdDeviation to blur and apply directly to el, because stdDeviation is not a css prop
    and therefore can't be animated

[] - Add keyframe CRUD

[x] - Show attributes and keyframes of attributes in animViewer

[x] - Make kfviewer update on create keyframe
# BigLab 2 - Class: 2021 WA1

## Team name: VSDA

Team members:
* s284101 Vespa Antonio
* s281561 Santa Rosa Antonino
* s278176 De Stefano Carmine
* s265350 Alagna Francesco

## Instructions

A general description of the BigLab 2 is avaible in the `course-materials` repository, [under _labs_](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/BigLab2/BigLab2.pdf). In the same repository, you can find the [instructions for GitHub Classroom](https://github.com/polito-WA1-AW1-2021/course-materials/tree/main/labs/GH-Classroom-BigLab-Instructions.pdf), covering this and the next BigLab.

Once cloned this repository, instead, write your names in the above section.

When committing on this repository, please, do **NOT** commit the `node_modules` directory, so that it is not pushed to GitHub.
This should be already automatically excluded from the `.gitignore` file, but double-check.

When another member of the team pulls the updated project from the repository, remember to run `npm install` in the project directory to recreate all the Node.js dependencies locally, in the `node_modules` folder.

Finally, remember to add the `final` tag for the final submission, otherwise it will not be graded.

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

### Get tasks
* URL: /api/tasks/all/[filter]
* HTTP Method: GET
* Description: retrieve the list of all the tasks, or the filtered ones
* Sample request:
    ```
    GET http://localhost:3001/api/tasks/all/important
    ```
* Request body: EMPTY
* Response:
* Response body:
    ```
    [ {id, description, important, private, completed, deadline}, {...}, ... ] 
    ```
* Error responses:


### Add task
* URL:
* HTTP Method:
* Description:
* Sample request:
    ```
    ```
* Request body:
* Response:
* Response body:
    ```  
    ```
* Error responses:


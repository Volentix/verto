# Utopian Task Requests

> Guide to creating a [Utopian](https://utopian.io/) task Request

This readme will take you through the process of creating a Task request for Verto. These task requests will be prioritized and pushed out to the Utopian community.

## Esacalation

Please note that [Utopian](https://utopian.io/) has its own general code of conduct and guidelines for behaviour. It is assumed that these guidelines are met and in parallel with the Volentix standard below.

In the event you are having an issue, please email arbitrator@volentix.io.

## Submit Task Request Process

The following outlines the process for submitting a task request.

1. Follow the instructions found in the [contributing guide.](../.github/CONTRIBUTING.md)
2. Create a file, prefixed with 'TR_', into the /utopian/inbox directory.
3. Copy the markup found in the [task request template](template.md) into the new file.
4. Fill in contents. replacing the following:


   **IMAGE_SOURCE:** The location of the image to be used by this post.

   **GOAL_STATEMENT:** Give you task request a clear goal. Use a story form narrative: As a < type of user >, I want < some goal > so that < some reason >.

   **STORY_DETAILS:** Give any details that the user should know.

   **SUCCESS_DETAILS:** Define what success looks like for the user. For example, running unit tests.

   **DEADLINE_DETAILS:** Provide details about the deadline.. if you have any.

   **GIT_HUB_USER_NAME:** Your GitHub username. This is required.
  
5. Create a pull request.
6. Receive a response within 48 hours from one of our team.

## Task Request Pipeline

The task request pipeline is identified by the folder structure in the utopian directory. This pipe has the following states:

1. **Inbox:** Where all requests are first sent through pull requests.
2. **Review:** The task request has been accepted through a pull request and is now ready for community review.
3. **Graveyard:** Ideas that did not make it past community review. Note that the graveyard exists so as to differentiate between successful (archived) and unsuccessful (graveyard) task requests.
4. **Posted:** The task request has been approved and is now posted for the Utopian community.
5. **Archived:** Once the task request is no longer valid, we will achieve it here.

## Task Request Workflow

The following outlines the workflow a task request will go upon submittal.

Note that this process will change significantly as the DAO forms around the repo. As a result, please regard the following as a first pass.

* Note that when moving the files from folder to folder, the commit message is extremely important for traceability and reasoning.

* Additionally, the assigned team member is responsible for all the file movements as well documentation, and posting activities.

1. This pull request is the addition of a file in the utopian/inbox folder. Task request reviewed by repository managers for standards, best practices, etc. Repository managers may ask for changes in format or content, before being added into the main repo.
2. Once approved, the task request will be pulled into the main project for public visibility. A team member is assigned the new task request.
3. Task request is moved from the `inbox` folder to the `review` folder
4. Team members are able to review and comment on the new task request.
5. Go/nogo vote by team. If nogo, the request is moved to the `graveyard` folder.
6. If go, move task request to the `posted` folder. Post the post on Steem.
7. Team member assigned to moderate the post.
8. Closing a task request.

   a. Finalize the task request on Steem
  
   b. Notify those responsible to pay out the contributor the additional vtx.
  
   c. Move the task request to the `archive` folder.

   d. Document retrospective and share with the team.


# Contributing

Please refer to the [Volentix Standard Contribution File](https://github.com/Volentix/documentation/blob/master/.github/CONTRIBUTING.md)

## In Addition

In addition to the `Volentix Standard Contribution File`, the following contains information specific to this project.

### Communication

Please join us on [Discord](https://discord.gg/wFAmdxq )

## What We Are Looking For

At the time of writting, we are seeking open source developers interested in Verto to first help us clean up the code base. To be honest, we are on our third iteration of the wallet and, as a result, have some issues with code styling, and testing.

Our main concerns at this time are:

1. Refactor pages into components where it makes sense.
2. Add unit testing everywhere
3. Harden the build process.

Once the above has been completed, or at least well underway, we will be looking to expand the capabilities of Verto and prepare it for the future. The following is a short list of items we are looking at moving forward:

0. More documentation.
1. Better UX.
2. More verbose data management strategy. This will allow third party `plugins` into Verto. These plugins will be able to share data between then with no back end server. Also, the user will always be able to manage what data, and with whom, they are sharing.
3. Change web hosting from S3 to IPFS.
4. Native Bitcoin wallet integration.
5. VDEX integration.
6. (Potential) Password recovery system using IPFS or something similar.

## Styling

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

### JavaScript Vue Styleguide

We use [Prettier](https://prettier.io) to format code before it is commited to the repository.
At the moment the plugins to automatically run this [seems to be broken](https://github.com/Volentix/venue-client/issues/236), so contributors are encouraged to run
eslint and Prettier manually.

ESLint modules:
```
'eslint:recommended',
'plugin:vue/recommended',
'plugin:prettier/recommended'
```


VS Code users are recommended to use the 
[Visual Studio Code Market Place: Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
with these configuration settings:
```
{
  "standard.enable": false,
  "eslint.autoFixOnSave": true,
  "eslint.validate": [ "javascript", { "language": "vue", "autoFix": true } ],
  "eslint.run": "onType"
}
```

### Documentation Styleguide

* Use [Markdown](https://daringfireball.net/projects/markdown) for README.md.
* Use [reStructuredText](http://docutils.sourceforge.net/rst.html) for [ReadtheDocs](https://readthedocs.org/) documenation in the /docs folder.


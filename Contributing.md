# CONTRIBUTING.md

We welcome contributions! Please see the CONTRIBUTING.md file for guidelines.

## Contributing to Project Title

Thank you for considering contributing to our project! We appreciate your help in making this project better.

## How to Contribute

### Check the Announcement from the Discussions

[Announcement](https://github.com/allanoguis/gojirun/discussions/27)

### **Fork the repository** Click on the "Fork" button at the top right of the page

Fork the repository to your own GitHub account by clicking on the "Fork" button. This will create a copy of the repository in your account.

### **Clone the  fork**

Clone the repository to your local machine using the command below.

```bash
git clone https://github.com/allanoguis/gojirun.git
```

### **Create a new branch**

Name the branch according to the feature you are working on.

```bash
git checkout -b feature/YourFeatureName
```

### **Make your changes and commit them**

Make the necessary changes to the code and commit them.

```bash
git commit -m "Add a descriptive commit message"
```

### **Push to your fork**

Push your changes to your fork on GitHub.

```bash
git push origin feature/YourFeatureName
```

### **Submit a pull request: Go to the original repository and click on "New Pull Request"**

Click on "New Pull Request" and select the branch you just pushed.

### **Wait for review and merge**

Wait for the project owner to review your changes and merge them into the main branch.

### **Prerequisites**

Before you begin, make sure you have met the following requirements:

- You have installed the latest version of [Git](https://git-scm.com/).
- You have a working installation of [Node.js](https://nodejs.org/) (or any other specific tool related to your project).
- You have read the project's [README.md](./README.md) for instructions on setting up the project.

### **Code of Conduct**

Please adhere to our [Code of Conduct](./CODE_OF_CONDUCT.md) when contributing to this project.

### **Testing Your Changes**

Before submitting your pull request, ensure that all existing tests pass and that any new tests are written and passing.
To run the tests locally, use the following command:

```bash
npm test   # or whatever command is relevant to your project
```

### Issues

> [!TIP]
> Make sure you to make a pull request from the branch created under the issues listed in the project.
> Create a pull request based on the branch created so we can track the pull request in reference to the issue number

![alt text](image.png)

> [!NOTE]
> Guidelines
>
> Write clear commit messages.
> Ensure that your code passes all tests.
> If you are fixing an issue, please reference it in your pull request.

### Before You Proceed

> [!TIP]
> Before making a new branch, Make sure to get the latest update from the main branch.
> `git fetch origin`
> `git pull`
> Then create a new branch based on the issue.
> Make sure that you are working on a single problem.
> If you have other concerns, feel free to go to discussions on the GitHub project and make a new discussion.

## PR Guidelines

### Write Small, Focused PRs

- **Keep it Small**: Aim to create small, focused pull requests that fulfill a single purpose. [Smaller PRs are easier and faster to review and merge, and they reduce the risk of introducing bugs1](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests).

### Review Your Own PR First

- **Self-Review**: Before submitting, review, build, and test your own pull request. [This helps catch errors or typos that you might have missed1](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests).

### Provide Context and Guidance

- **Clear Titles and Descriptions**: Write clear titles and descriptions for your pull requests so that reviewers can quickly understand what the PR does. [Include the purpose of the PR, an overview of what changed, and links to any additional context such as tracking issues or previous conversations1](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests).

- **Guidance for Reviewers**: If your PR consists of changes to multiple files, provide guidance to reviewers about the order in which to review the files. [Recommend where to start and how to proceed with the review1](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests).

### Use Pull Request Templates

- **Standardize Information**: Use pull request templates to standardize the information included when someone creates a PR in your repository. [This can include a list of tasks to complete before merging1](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests).

### Link to Issues

- **Reference Issues**: Include an issue reference in your PR body to automatically close the issue when the PR is merged. [This helps keep your project organized1](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests).

### Communicate Clearly

- **Feedback Requests**: Share the type of feedback you need. [For example, specify if you need a quick look or a deeper critique1](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests).

- [**Ask Questions**: If you’re unsure about something, ask questions in the PR description to get the necessary feedback from reviewers2](https://github.blog/developer-skills/github/how-to-write-the-perfect-pull-request/).

### Test Thoroughly

- [**Automated and Manual Testing**: Ensure your changes are thoroughly tested, both manually and with automated tests, to catch any potential issues before the PR is reviewed1](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/getting-started/best-practices-for-pull-requests).

> [!TIP]
> For major changes or UI changes, please include a screenshot on how it looks like on your end.
> It'll make the review faster for easier and faster pull merges.

![image](https://github.com/user-attachments/assets/9ae950cb-5f8b-476f-8cd7-a00eaf989a8a)

Happy Hacking!

[EOF]

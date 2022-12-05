export default {
  action: {
    login: 'Login',
    signup: 'Sign up',
    resetPassword: 'Reset Password',
    mailHasBeenSent: "We've just sent an email, please check your mailbox",
    mailDoesntExist:
      'There is no account associated with this username or email address',
    deleteMyAssets: 'I confirm i want to delete my asset(s)',
    deleteMyIps: 'I confirm i want to delete my IP',
    cancel: 'Cancel',
    deleteSelectedAssets: 'Delete Selected Assets',
    submit: 'Submit',
    addVulnerabilitiesToSelectedAssets:
      'Add vulnerabilities to selected Assets',
    save: 'Save'
  },
  t: {
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    forgotYourPassword: 'Forgot your password ?',
    ReturnToLoginPage: 'Return to login page',
    usernameOrEmail: 'Username or Email',
    loginUnsuccessful: 'Login unsuccessful. Please try again.',
    resetPasswordFailed: 'Reset password failed. Please try again.',
    errorLogin: 'Login failed. Please try again.',
    deleteMessage: 'You are going to delete :',
    irreversibleAction: 'This action is irreversible',
    noDataToShow: 'No data to show',
    loading: 'Loading...'
  },
  validation: {
    emailRequired: 'Email is required',
    passwordRequired: 'Password is required'
  },
  projectManagement: {
    noProject: 'No projects',
    id: 'ID',
    projectName: 'Project Name',
    projectOwner: 'Owner',
    priority: 'Priority',
    priorityLevel: {
      critical: 'Critical',
      high: 'High',
      medium: 'Medium',
      low: 'Low'
    },
    status: 'Status',
    statusLevel: {
      open: 'Open',
      in_progress: 'In progress',
      to_review: 'To review',
      completed: 'Completed',
      canceled: 'Canceled',
      overdue: 'Overdue'
    },
    transitions: {
      start: 'Start',
      accept: 'Accept',
      refuse: 'Refuse',
      send_for_review: 'Send for review',
      cancel: 'Cancel',
      re_open: 'Re-open'
    },
    deadline: 'Deadline',
    remediationProject: {
      title: 'Remediation project',
      closest_deadline:
        '{project_id} has the closest deadline on the {due_date}',
      noClosestDeadline: 'No future milestones',
      projectOverdue:
        'No projects | {0} project exceeds the deadline | {0} projects exceed the deadline',
      projectInTime: 'All projects are in time !'
    }
  }
}

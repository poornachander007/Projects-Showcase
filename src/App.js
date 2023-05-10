import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const websiteLogoUrl =
  'https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png'
const failureUrl =
  'https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png'
const apiStatusViews = {
  initial: 'INITIAL',
  in_progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
// Replace your code here
class App extends Component {
  state = {
    projectsList: [],
    apiStatus: apiStatusViews.initial,
    category: categoriesList[0].id,
  }

  componentDidMount() {
    this.getProjectsList()
  }

  onChangeOption = event => {
    this.setState({category: event.target.value}, this.getProjectsList)
  }

  getProjectsList = async () => {
    this.setState({apiStatus: apiStatusViews.in_progress})
    const {category} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${category}`
    const response = await fetch(apiUrl)
    if (response.ok === true) {
      const data = await response.json()
      const projectsData = data.projects
      const updatedData = projectsData.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusViews.success,
      })
    } else {
      this.setState({apiStatus: apiStatusViews.failure})
    }
  }

  renderSuccessView = () => {
    const {projectsList, category} = this.state

    return (
      <ul style={{display: 'flex', flexWrap: 'wrap'}}>
        {projectsList.map(eachItem => (
          <li key={eachItem.id}>
            <img src={eachItem.imageUrl} alt={eachItem.name} width={300} />
            <p>{eachItem.name}</p>
          </li>
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  onClickRetry = () => {
    this.getProjectsList()
  }

  renderFailureView = () => (
    <div>
      <img src={failureUrl} alt="failure view" width={600} />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <div>
        <button type="button" onClick={this.onClickRetry}>
          Retry
        </button>
      </div>
    </div>
  )

  renderProjectsView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusViews.in_progress:
        return this.renderLoadingView()
      case apiStatusViews.success:
        return this.renderSuccessView()
      case apiStatusViews.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app_container">
        <nav className="nav_bar">
          <img src={websiteLogoUrl} alt="website logo" />
        </nav>
        <div>
          <select onChange={this.onChangeOption}>
            {categoriesList.map(eachItem => (
              <option key={eachItem.id} value={eachItem.id}>
                {eachItem.displayText}
              </option>
            ))}
          </select>
          {this.renderProjectsView()}
        </div>
      </div>
    )
  }
}

export default App

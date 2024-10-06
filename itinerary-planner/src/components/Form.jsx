import { render } from "react-dom";
import { useState, useEffect } from "react";

import "./form-styles.scss";

const Field = ({ label, id, value, ...rest }) => (
    <div>
        <label htmlFor={id}>{label}</label>
        <input id={id} value={value} required {...rest} />
    </div>
);

const UserCard = ({ pref, userIndex }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleDetails = () => {
        setIsExpanded(prevState => !prevState);
    };

    return (
        <div class="user-card" key={userIndex}>
            <h2>Traveler {userIndex + 1}</h2>
            <button className="see-more" onClick={toggleDetails}>
                {isExpanded ? 'See Less...' : 'See More...'}
            </button>
            {isExpanded && (
                <div>
                    <p><strong>Season:</strong> {pref.season}</p>
                    <p><strong>Activity Budget:</strong> {pref['activity-budget']}</p>
                    <p><strong>Meal Budget:</strong> {pref['meal-budget']}</p>
                    <p><strong>Nature or City:</strong> {pref['nature-city']}</p>
                    <p><strong>Indoor or Outdoor:</strong> {pref['indoor-outdoor']}</p>
                    <p><strong>Departing Location:</strong> {pref['departing-loc']}</p>
                    <p><strong>Transit:</strong> {pref.transit}</p>
                    <p><strong>Accommodation:</strong> {pref.accomodation}</p>
                </div>
            )}
        </div>
    );
};

function Form() {
    // Handle submission of form and updating of user cards
    const [formData, setFormData] = useState({});
    const [fileContent, setFileContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        try {
            const response = await fetch('http://localhost:3001/submit', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData), // Send the form data
            });

            if (!response.ok) {
                alert('Failed to save traveler information.');
            }
        } catch (error) {
            alert('An error occurred: ' + error.message);
        }
        setFormData({});

        try {
            const response = await fetch('http://localhost:3001/read-file');
            if (!response.ok) {
                throw new Error('Failed to fetch traveler profiles.');
            }
            const text = await response.text();
            setFileContent(JSON.parse(text));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Clear form upon page reload
    useEffect(() => {
        fetch('http://localhost:3001/clear', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Send the form data
        });
    }, []);

    // Handle page refresh
    window.addEventListener("beforeunload", (event) => {
        fetch('http://localhost:3001/clear', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Send the form data
        });
        console.log("API call before page reload");
    });

    window.addEventListener("unload", (event) => {
        fetch('http://localhost:3001/clear', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData), // Send the form data
        });
        console.log("API call after page reload");
    });

    return (
        <>
            <h1 id="form" className="formTitle">Individual Preference Form</h1>
            <p>Each member of your group should fill out this form with preferred travel preferences!</p>
            <form onSubmit={handleSubmit}>
                <Field
                    label="Is there anywhere you would prefer to visit?"
                    id="dest"
                    name="dest"
                    placeholder="i.e. New York City, Japan"
                    value={formData.dest || ''}
                    onChange={handleChange}
                />  
                <Field
                    label="How many long do you plan on traveling for?"
                    id="length"
                    name="length"
                    placeholder="i.e. 3 days, 2 weeks"
                    value={formData.length || ''}
                    onChange={handleChange}
                />
                <Field
                    label="How many people do you plan on traveling with?"
                    id="people"
                    name="people"
                    placeholder="i.e. 4 peopls, 2 people"
                    value={formData.people || ''}
                    onChange={handleChange}
                />
                <Field
                    label="What month or season do you want to travel?"
                    id="season"
                    name="season"
                    placeholder="i.e. Winter, July"
                    value={formData.season || ''}
                    onChange={handleChange}
                />
                <Field
                    label="What is the max you want to spend on one activity?"
                    id="activity-budget"
                    name="activity-budget"
                    placeholder="i.e. $30"
                    value={formData['activity-budget'] || ''}
                    onChange={handleChange}
                />
                <Field
                    label="What is the max you want to spend on one meal?"
                    id="meal-budget"
                    name="meal-budget"
                    placeholder="i.e. $30"
                    value={formData['meal-budget'] || ''}
                    onChange={handleChange}
                />
                <Field
                    label="Would you like to explore more natural environments (parks, hiking spots, scenic views), or do you prefer staying in the heart of the city (restaurants, nightlife, city tours)?"
                    id="nature-city"
                    name="nature-city"
                    placeholder="i.e. balance of both"
                    value={formData['nature-city'] || ''}
                    onChange={handleChange}
                />
                <Field
                    label="Do you want more indoor experiences (museums, shopping, etc.) or outdoor adventures (parks, walking tours, etc.)?"
                    id="indoor-outdoor"
                    name="indoor-outdoor"
                    placeholder="i.e. outdoors"
                    value={formData['indoor-outdoor'] || ''}
                    onChange={handleChange}
                />
                <Field
                    label="Where will you be traveling from?"
                    id="departing-loc"
                    name="departing-loc"
                    placeholder="i.e. New York City"
                    value={formData['departing-loc'] || ''}
                    onChange={handleChange}
                />
                <Field
                    label="Do you plan to use public transit (e.g., buses, trains, plane), rent a car, or will you have your own vehicle for getting around?"
                    id="transit"
                    name="transit"
                    placeholder="i.e. public transit"
                    value={formData.transit || ''}
                    onChange={handleChange}
                />
                <Field
                    label="Do you have a preferred type of accommodation (hotel, Airbnb, hostel) and/or nightly budget?"
                    id="accomodation"
                    name="accomodation"
                    placeholder="i.e. No preferred type, around $100 per night budget"
                    value={formData.accomodation || ''}
                    onChange={handleChange}
                />
                <input type="submit" />
            </form>

            <div>
                {
                    (() => {
                        if (fileContent.length === 0) {
                            return (
                                <p>No traveler profiles submitted. Please fill out the form to add travelers.</p>
                            )
                        } else {
                            return (
                                <div class="card-container">
                                    {fileContent.map((pref, index) => (
                                        <UserCard key={index} pref={pref} userIndex={index} />
                                    ))}
                                </div>
                            )
                        }
                    })()  
                }
            </div>
        </>
    );
}

render(<Form />, document.getElementById("root"));

export default Form;

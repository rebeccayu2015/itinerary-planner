import openai
import sys
import json
import os

def main():
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: python3 itinerary.py <path_to_json>"}))
        sys.exit(1)

    json_path = sys.argv[1]

    try:
        with open(json_path, 'r') as f:
            form_data = json.load(f)
    except Exception as e:
        print(json.dumps({"error": f"Failed to read JSON file: {str(e)}"}))
        sys.exit(1)

    prompt = f"""
    DO NOT START WITH 
    
    ```html
    
    in the beginning  

    You are an expert travel planner specializing in creating highly personalized and detailed group travel itineraries. Based on the preferences of a group of travelers, you will generate a tailored itinerary for a specific location that aligns with their needs, interests, and budgets. The itinerary should be comprehensive, taking into account various factors such as activities, dining, accommodation, and transportation, as detailed below:

    ### Information Provided:
    **1. Location Details** 
    - *Current Location & Destination*: {form_data.get('departing-loc', 'N/A')} to [Destination].
    - *Travel Season*: {form_data.get('season', 'N/A')}.
    
    **2. Budget Considerations** 
    - *Experience Budget*: ${form_data.get('activity-budget', 'N/A')} max per person.
    - *Meal Budget*: ${form_data.get('meal-budget', 'N/A')} max per person.
    - *Accommodation Budget*: ${form_data.get('accomodation', 'N/A')} per person per night.
    - *Transportation Budget*: {form_data.get('transit', 'N/A')}.
    
    **3. Preferences for Activities & Environment** 
    - *Indoor vs. Outdoor*: {form_data.get('indoor-outdoor', 'N/A')}.
    - *Nature vs. City Vibe*: {form_data.get('nature-city', 'N/A')}.
    - *Desired Location*: {form_data.get('dest', 'N/A')}.

    **4. Length and Number of People** 
    - *Length of vacation or trip*: {form_data.get('length', 'N/A')}.
    - *Number of people TOTAL going*: {form_data.get('people', 'N/A')}.

    You are an expert travel planner specializing in creating highly personalized and detailed group travel itineraries. Based on the preferences of a group of travelers, you will generate a tailored itinerary that aligns with their needs, interests, and budgets.
    CONSIDERATIONS:
    **1. Location Details**  
    - *Current Location & Destination*: Where the group will be traveling from and their intended destination. This will allow for the best planning of routes, travel time, and modes of transportation.
    - *Travel Season*: The month or season when the trip will occur. Take into account weather conditions, seasonal attractions, festivals, and events that may influence the recommendations.

    **2. Budget Considerations**  
    - *Landmarks & Experiences*: The maximum cost each person is willing to spend on individual experiences (e.g., landmark entry fees, tours, special activities). Use this to select affordable attractions and activities.
    - *Meal Budget*: The typical cost per person for meals. Choose restaurants, cafes, and dining options that fit within the specified price range, providing options for breakfast, lunch, and dinner.
    - *Accommodation Budget & Preferences*: The nightly budget per person for accommodations and preferred types (e.g., hotel, Airbnb, hostel). Use this to select lodging that meets both financial and comfort preferences.
    - *Transportation Budget*: Whether the group plans to use public transit, rent a car, or has their own vehicle. Factor in costs for transportation, including:
    - *Public Transit*: Price of bus, train, or metro tickets.
    - *Car Rentals*: Rental fees, gas costs, and parking fees.
    - *Rideshare Services*: Cost of Uber or Lyft rides, estimated per person based on travel within the city.
    - *Flights/Trains*: If relevant, take into account flights or long-distance train fares between the current location and destination.

    **3. Preferences for Activities & Environment**  
    - *Indoor vs. Outdoor Activities*: The group’s preference for indoor experiences (e.g., museums, shopping, shows) versus outdoor activities (e.g., parks, hiking, city tours). Recommend activities that align with these interests.
    - *Nature vs. City Vibe*: Whether the group prefers to explore natural settings (e.g., national parks, nature reserves) or have a more urban experience (e.g., city tours, nightlife). Make sure to balance suggestions to fit the group's desired ambiance.
    - *Unique/Local Experiences*: Prioritize local culture and experiences that match the group's interests, such as unique dining spots, lesser-known landmarks, or local events that reflect the essence of the destination.

    **4. Itinerary Structure**  
    - Create a structured, day-by-day itinerary covering activities from morning to night. YOU HAVE TO OUTPUT ALL DAYS, as that is your objective, so DO NOT skip days. Provide options that balance travel time, sightseeing, and relaxation, accounting for the following:
    - *Morning Activities*: Sightseeing, breakfast spots, or starting outdoor adventures.
    - *Afternoon Plans*: Landmark visits, lunch spots, and guided tours or experiences.
    - *Evening/Night Plans*: Dinner options, nightlife activities, or scenic views for winding down.
    - If possible, suggest alternative options for each time of day, allowing flexibility based on weather, mood, or changing interests.

    **5. Specific Details in Each Recommendation**  
    - *Name & Description*: Provide the name of each place or activity, along with a brief description of what makes it a recommended choice.
    - *Cost Breakdown*: Offer an estimated cost for each recommendation (e.g., meal prices, entry fees, transportation costs), making sure it aligns with the group's specified budget.
    - *Seasonal Considerations*: Indicate any activities that are seasonal or weather-dependent, recommending backup options in case of unexpected weather changes.
    - *Proximity & Logistics*: Arrange the activities in an order that minimizes travel time between locations. If using public transit, provide details on routes, estimated travel times, and fare costs. For car rentals or rideshares, include estimated journey times and parking/ride costs.

    The goal is to provide a travel plan that is detailed, budget-conscious, and fully aligned with the preferences of the group. Ensure that the recommendations are varied, cover all aspects of the trip (from meals to activities to transportation), and are tailored to create a unique and memorable experience.
    """

    prompt1 = """
    YOU MUST FOLLOW THIS FORMAT AND RULE, DO NOT input any additional comments in the beginning or end, and BE SPECIFIC (e.g. don't just say 'historical landmark', actually name one). LASTLY, MAKE SURE HTML WILL COMPILE with NO ERRORS. 
    THE ONLY EXCEPTION is that YOU CAN OUTPUT ADDITIONAL DAYS. MAKE SURE to OUTPUT ITINERARY FOR ALL DAYS! YOU HAVE TO OUTPUT ALL DAYS, as that is your objective, so DO NOT skip days!

    IMPORTANT Please generate a travel itinerary in the following example html format below. Ensure that the structure matches exactly as shown below for EACH day, BUT you can ADD MORE DAYS in the same FORMAT (don't copy CONTENTS, ONLY FORMAT). Start and end EXACTLY as shown below and don't start with three apostrophes :

        <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide">
                    <div class="itinerary-card">
                        <h2>4-Day Nature-Focused Trip to the NY</h2>
                        <h3>Group Overview:</h3>
                        <ul>
                            <li><strong>Travelers:</strong> 5 people</li>
                            <li><strong>Travel Dates:</strong> Summer</li>
                            <li><strong>Current Location:</strong> New York City (NYC)</li>
                            <li><strong>Destination:</strong> Catskills, NY</li>
                            <li><strong>Budget:</strong>
                                <ul>
                                    <li><strong>Experience:</strong> $150 max per person</li>
                                    <li><strong>Meals:</strong> $100 max per person</li>
                                    <li><strong>Accommodation:</strong> $50 per person per night</li>
                                </ul>
                            </li>
                            <li><strong>Preferences:</strong> Outdoor activities, close to nature, cooking, and dining out</li>
                        </ul>
                        <hr/>
                        <h3>Day 1: Arrival & Exploration</h3>
                        <p><strong>Morning: Travel to Catskills</strong></p>
                        <ul>
                            <li><strong>Transportation:</strong> Rent a van for the trip (5 people).</li>
                            <li><strong>Cost:</strong> Approximately $150/day + $40 gas for round trip from NYC to Catskills (3 hours).</li>
                            <li><strong>Total per person:</strong> $38</li>
                        </ul>
                        <p><strong>Afternoon: Check-in & Lunch</strong></p>
                        <ul>
                            <li><strong>Accommodation:</strong> Airbnb or local cabin (3 nights).</li>
                            <li><strong>Cost:</strong> $250 total for 3 nights / 5 people = $50 per person per night.</li>
                            <li><strong>Lunch Option:</strong> <em>The Greenhouse in the Catskills</em>
                                <ul>
                                    <li><strong>Description:</strong> Farm-to-table lunch spot with fresh, local ingredients.</li>
                                    <li><strong>Cost:</strong> ~$20 per person.</li>
                                </ul>
                            </li>
                        </ul>
                        <p><strong>Afternoon: Outdoor Activity</strong></p>
                        <ul>
                            <li><strong>Activity:</strong> <em>Hiking at Kaaterskill Falls</em></li>
                            <li><strong>Description:</strong> A stunning 2.6-mile round-trip hike leading to one of the tallest waterfalls in New York.</li>
                            <li><strong>Cost:</strong> Free.</li>
                            <li><strong>Notes:</strong> Bring water and snacks.</li>
                        </ul>
                        <p><strong>Evening: Dinner & Relaxation</strong></p>
                        <ul>
                            <li><strong>Dinner Option:</strong> <em>The Last Chance Tavern</em>
                                <ul>
                                    <li><strong>Description:</strong> Local pub with hearty American fare.</li>
                                    <li><strong>Cost:</strong> ~$25 per person.</li>
                                </ul>
                            </li>
                            <li><strong>Evening Activity:</strong> Relax at the cabin, enjoy a bonfire, or play board games.</li>
                        </ul>
                        <hr/>
                        <h3>Cost Breakdown Summary (Per Person)</h3>
                        <ul>
                            <li><strong>Transportation:</strong> $38</li>
                            <li><strong>Accommodation:</strong> $150 (3 nights)</li>
                            <li><strong>Meals:</strong> ~$70 (breakfasts, lunches, dinners)</li>
                            <li><strong>Activities:</strong> ~$40 (kayaking, biking)</li>
                            <li><strong>Total Estimated Cost:</strong> ~$298</li>
                        </ul>
                        <h4>Additional Notes:</h4>
                        <ul>
                            <li>Adjust the schedule based on weather; have indoor options (like visiting local museums or artists’ studios) if needed.</li>
                            <li>Ensure to book accommodations and rentals in advance to secure the best deals.</li>
                            <li>Bring cash for small-town eateries and markets that may not accept cards.</li>
                        </ul>
                        <p><em>This itinerary balances outdoor activities and relaxation while allowing for cooking and dining out, ensuring a memorable trip for the whole group. Enjoy your adventure in the Catskills!</em></p>
                    </div>
                </div>
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
        </div>
    """


    openai.api_key = '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'

    try:
        response = openai.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "user", "content": prompt + prompt1}
            ],
            temperature=0.7,
            max_tokens=2000
        )

        itinerary_html = response.choices[0].message.content.replace('```html', '')

        json_output = json.dumps({"itinerary_html": itinerary_html})
        print(json_output)


    except openai.error as e:
        print(json.dumps({"error": f"OpenAI API error: {str(e)}"}))
        sys.exit(1)
    except Exception as e:
        # Capture any other errors
        print(json.dumps({"error": f"An unexpected error occurred: {str(e)}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()

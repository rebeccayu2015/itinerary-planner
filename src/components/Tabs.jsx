import React, { useState } from 'react';

function Tabs({ tabs }) {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <ul className="nav nav-tabs">
                {tabs.map((tab, index) => (
                    <li className="nav-item" key={index}>
                        <button
                            className={`nav-link ${index === activeTab ? 'active' : ''}`}
                            onClick={() => setActiveTab(index)}
                        >
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="tab-content">
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={`tab-pane ${index === activeTab ? 'active' : ''}`}
                    >
                        {tab.content}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Tabs;
import { useState } from 'react';
import { Grid2 as Grid } from '@mui/material';

const TabComponent = () => {
  // State to track which tab is selected
  const [activeTab, setActiveTab] = useState(0);

  // Array of tab labels
  const tabs = ['Home', 'About', 'Listings'];

  // Content for each tab
  const tabContent = [
    'Content for Tab 1',
    'Content for Tab 2',
    'Content for Tab 3',
  ];

  return (
    <Grid>
      <Grid>
        {/* Render tabs */}
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            style={{
              padding: '10px',
              margin: '5px',
              backgroundColor: activeTab === index ? 'lightblue' : 'lightgray',
              border: '1px solid #ddd',
            }}
          >
            {tab}
          </button>
        ))}
      </Grid>

      {/* Render the content of the active tab */}
      <Grid>
        <h2>{tabs[activeTab]}</h2>
        <p>{tabContent[activeTab]}</p>
      </Grid>
    </Grid>
  );
};

export default TabComponent;

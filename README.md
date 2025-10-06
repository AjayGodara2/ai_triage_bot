AI Triage Bot
About the Project

The AI Triage Bot is an intelligent healthcare assistant designed to help users analyze symptoms and provide possible diagnoses, treatment suggestions, and historical patient data. This tool is particularly useful for remote areas with limited access to medical professionals. The bot leverages patient data to estimate risk factors, mortality rates, and possible health outcomes.

Key Features:

Chat interface for interactive symptom input.

Analysis based on age, gender, symptoms, and other patient data.

Provides possible conditions, suggested treatments, and historical insights.

Supports research on past patient cases for better understanding of risks and outcomes.

File Structure

The project structure is organized as follows:

ai-triage-bot/
│
├─ src/                  # Source code for the bot
├─ dist/                 # Compiled or production-ready files
├─ node_modules/         # Dependencies (installed via npm)
├─ .env                  # Environment variables (for sensitive information)
├─ data.zip              # Placeholder for large dataset
├─ README.md             # Project documentation
└─ package.json          # NPM configuration file

Important Notes

The current data.zip file is a placeholder for the actual dataset. Before running the project, replace this zip file with your dataset. Ensure the structure and naming of files inside the zip match the expected format used by the bot.

The dataset is essential for the bot to analyze symptoms and provide accurate suggestions.

Installation

Clone the repository:

git clone <repository_url>
cd ai-triage-bot


Install dependencies:

npm install


Replace the data.zip with your actual dataset.

Start the application:

npm start

Usage

Launch the bot and interact via the chat interface.

Input patient information, symptoms, age, and gender.

The bot will return possible diagnoses, recommended actions, and insights from historical data.

License

This project is open-source and free to use for educational and research purposes.

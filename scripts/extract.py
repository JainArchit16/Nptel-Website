import os
import re
import pdfplumber
import json


def extract_questions_answers(pdf_path, week, subject):
    quiz_data = []
    multi_line_question = ""

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if not text:
                continue

            lines = text.split('\n')

            # Regex patterns
            question_pattern = re.compile(r'^\d+\)')  # Detect question
            option_pattern = re.compile(r'^[A-E]\.')  # Detect options (A-E)
            correct_pattern = re.compile(r'^Ans\.\s([A-E]|True|False)')  # Detect correct answer (A-E or True/False)

            question, options, correct_answer = None, [], None

            for line in lines:
                line = line.strip()

                # Detect question
                if question_pattern.match(line):
                    if question and len(options) >= 2 and correct_answer is not None:
                        quiz_data.append({
                            'week': week,
                            'subject': subject,
                            'questionText': question.strip(),
                            'options': options,
                            'correctOption': correct_answer
                        })
                    multi_line_question = line.strip()
                    question, options, correct_answer = None, [], None

                # Detect options
                elif option_pattern.match(line) or line in ["True", "False"]:
                    if multi_line_question:
                        question = multi_line_question
                        multi_line_question = ""
                    options.append(line.strip())

                # Detect correct answer
                elif correct_pattern.match(line):
                    correct_letter = correct_pattern.match(line).group(1)
                    if correct_letter in ["True", "False"]:
                        correct_answer = 0 if correct_letter == "True" else 1
                    else:
                        correct_answer = ord(correct_letter) - ord('A')  # Convert A-E to 0-4

                # Multi-line question continuation
                else:
                    if multi_line_question and line and not option_pattern.match(line):
                        multi_line_question += ' ' + line

            # Save last question if all parts are present
            if question and len(options) >= 2 and correct_answer is not None:
                quiz_data.append({
                    'week': week,
                    'subject': subject,
                    'questionText': question.strip(),
                    'options': options,
                    'correctOption': correct_answer
                })

    return quiz_data


def extract_and_save_to_json(base_directory, output_file):
    all_data = []

    if not os.path.exists(base_directory):
        print(f"Base directory {base_directory} does not exist.")
        return

    # Walk through subdirectories and process all PDFs
    for root, _, files in os.walk(base_directory):
        subject = os.path.basename(root)  # Infer subject name from folder name
        for filename in files:
            if filename.endswith('.pdf'):
                pdf_path = os.path.join(root, filename)
                # Infer week from filename or folder structure
                week_match = re.search(r'(\d+)', filename)  # Extract the week number from filename
                week = int(week_match.group(1)) if week_match else 0
                try:
                    data = extract_questions_answers(pdf_path, week, subject)
                    all_data.extend(data)
                except Exception as e:
                    print(f"Error processing {filename} in {root}: {e}")

    with open(output_file, 'w') as f:
        json.dump(all_data, f, indent=4)
    print(f"Saved data to {output_file}")


# Example usage
base_directory = './questions'
output_json = './extracted_data/quiz_data.json'
extract_and_save_to_json(base_directory, output_json)

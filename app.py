import streamlit as st
import google.generativeai as genai
import fitz
import os
#from frontend import *

st.set_page_config(
    page_title = "LexiShield AI",
    page_icon = "🛡️",
    layout = "wide"
)


try:
    API_KEY = st.secrets["GOOGLE_API_KEY"]
    # GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
    

except (KeyError, FileNotFoundError):
    st.error("Please add your GOOGLE_API_KEY to your Streamlit secrets file.")
    st.stop()

genai.configure(api_key= API_KEY)

model = genai.GenerativeModel('gemini-1.5-flash')



# -------UI--------

st.title("LexiShield AI")
st.write("This is a prototype")


#  PDF upload and extract

uploaded_file = st.file_uploader("Enter your legal Document:", type = "pdf")

extracted_text = " "

if uploaded_file is not None:
    try:
        with fitz.open(stream= uploaded_file.read(), filetype="pdf") as doc:
            for page in doc:
                extracted_text += page.get_text()

        st.success("PDF successfully uploaded. You can now use below features")

        st.text_area("Legal document:", extracted_text, height= 150)

    except Exception as e:
        st.error(f"Error processing PDF file: {e}")
        st.stop()


# ---- Feature Buttons -----

st.header("AI Analysis Features")
col1, col2, col3, col4 = st.columns(4)

with col1:
    if st.button("summarize Document"):
        if extracted_text:
            st.subheader("Summary")
            with st.spinner("Generating summary..."):
                prompt = f"Summarize the following legal document in simple, easy-to-understand terms for a non-lawyer.Also, don't leave any important clause or term perform this task as a high priority and caution task. This is the legal document: '{extracted_text}'"
                response = model.generate_content(prompt)
                st.success(response.text)

        else:
            st.warning("please upload the PDF document first.")


with col2:
    if st.button("Explain Jargon"):
        if extracted_text:
            st.subheader("Jargon Buster")
            with st.spinner("Identifying and explaining Jargons..."):
                prompt = f"Identify all the legal jargon or complex terms/clauses in the following text and explain each one with their effects in simple ways:  '{extracted_text}'"
                response = model.generate_content(prompt)
                st.success(response.text)

        else:
            st.warning("please upload the PDF document first.")



with col3:
    if st.button("Detect Asymmetry (Unfairness)"):
        if extracted_text:
            st.subheader("Asymmetry Detector")
            with st.spinner("Analysing asymmetry in the document..."):
                prompt = f"Act as a legal expert  specializing in contract faireness detection for an indivisual. Analyse and identify the most important clauses that are one-sided, imbalanced or unfair. Explain their consequences :{extracted_text}'"
                response = model.generate_content(prompt)
                st.success(response.text)

        else:
            st.warning("please upload the PDF document first.")


with col4:
    if st.button("Detect Loopholes"):
        if extracted_text:
            st.subheader("Loophole Detector")
            with st.spinner("Analysing Loopholes in the document..."):
                prompt = f"Act as a legal expert  specializing in contract loopholes detection. Analyse and identify missing clauses and terms , contradicting terms or clauses or any confusion creating clause that may lead to a loophole:  :{extracted_text}'"
                response = model.generate_content(prompt)
                st.success(response.text)

        else:
            st.warning("please upload the PDF document first.")

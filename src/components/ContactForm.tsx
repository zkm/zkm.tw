import React, { FC, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Form = styled.form`
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  text-align: left;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  resize: vertical;
  text-align: left;
  margin-bottom: 1em;
`;

const FormTextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  resize: vertical;
  text-align: left;
  margin-bottom: 1em;
`;

const FormSubmitBtn = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  float: right;

  &:hover {
    background-color: #45a049;
  }
`;

const SuccessMsg = styled.p`
  margin: 8px 0;
  color: green;
  font-size: 12px;
`;

const ErrorMsg = styled.p`
  margin: 8px 0;
  color: red;
  font-size: 12px;
`;
interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await axios.post('/api/contact', formData);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch {
      setSubmitError(true);
      setTimeout(() => setSubmitError(false), 3000);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {submitSuccess && <SuccessMsg>Form submitted successfully!</SuccessMsg>}
      {submitError && <ErrorMsg>Error submitting form.</ErrorMsg>}
      <FormLabel htmlFor="name">Name:</FormLabel>
      <FormInput type="text" id="name" name="name" onChange={handleInputChange} />
      <br />
      <FormLabel htmlFor="email">Email:</FormLabel>
      <FormInput type="email" id="email" name="email" onChange={handleInputChange} />
      <br />
      <FormLabel htmlFor="message">Message:</FormLabel>
      <FormTextArea id="message" name="message" onChange={handleInputChange} />
      <br />
      <FormSubmitBtn type="submit">Send</FormSubmitBtn>
    </Form>
  );
};

export default ContactForm;

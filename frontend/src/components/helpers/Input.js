/* global $ */
import React from 'react';
import { Form } from 'react-bootstrap';

const Input = (type, controlProps) => ({ title, state: [value, onChange], required }) => (
  <Form.Group>
    <Form.Label>{title}</Form.Label>
    <Form.Control defaultValue={value} onChange={e => onChange(e.target.value)} type={type} required={required} {...controlProps} />
  </Form.Group>
);

export const Text = Input('text');
export const URL = Input('url');
export const Number = Input('number');

export const TextArea = Input('text', { as: 'textarea', rows: 3 });

export const TextInline = ({ title, state: [value, onChange], required }) => (
  <Form.Control
    defaultValue={value}
    onChange={e => onChange(e.target.value)}
    type="text"
    required={required}
    placeholder={title}
  />
);

export const Select = ({ title, allowEmpty = true, state: [value, onChange] = [null, console.log(title) || (() => { })], bool = false, options = bool ? [['Yes', true], ['No', false]] : [], required }) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    console.log(ref);
    $(ref.current).selectpicker({ size: 10 });
  }, [ref]);
  return (
    <Form.Group>
      <Form.Label>{title}</Form.Label>
      <Form.Control
        ref={ref}
        as="select"
        size="lg"
        value={options.findIndex(o => o[1] === value)}
        required={required}
        onChange={e => onChange(options[e.target.value][1])}
      >
        { allowEmpty && <option disabled value={-1}></option> }
        { options.map(([k, v = k], index) => <option key={k} value={index}>{k}</option>) }
      </Form.Control>
    </Form.Group>
  );
};
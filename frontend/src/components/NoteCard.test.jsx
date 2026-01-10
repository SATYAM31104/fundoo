import React from 'react';
import { shallow } from 'enzyme';
import NoteCard from './NoteCard';
import withAnimation from './withAnimation';

// We need to test the unwrapped component or mock the HOC
const NoteCardUnwrapped = NoteCard.WrappedComponent || NoteCard;

describe('NoteCard Component', () => {
    const mockNote = {
        _id: '1',
        title: 'Test Note',
        description: 'Test Description',
        labels: ['tag1'],
        checklist: []
    };

    it('should render the note title', () => {
        // Since NoteCard is exported wrapped withAnimation, 
        // shallow rendering might just show the HOC.
        // For unit testing the logic inside, we can either:
        // 1. Export the unwrapped component (best)
        // 2. Dive into the shallow render

        const wrapper = shallow(<NoteCardUnwrapped note={mockNote} />);
        expect(wrapper.find('.card-title').text()).toEqual('Test Note');
    });

    it('should render labels if present', () => {
        const wrapper = shallow(<NoteCardUnwrapped note={mockNote} />);
        expect(wrapper.find('.card-label-chip')).toHaveLength(1);
    });
});

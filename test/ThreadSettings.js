import { expect } from 'chai';

import {
  GreetingText,
  GetStartedButton,
  PersistentMenu,
  PersistentMenuItem
} from '../lib/ThreadSettings';

describe('Thread Settings', () => {
  describe('Greeting text', () => {
    it('returns proper object', () => {
      let text = new GreetingText('Welcome to My Company!');
      expect(text).to.deep.equal({
        'setting_type':'greeting',
        'greeting':{
          'text':'Welcome to My Company!'
        }
      });
    });
  });

  describe('Get started button', () => {
    it('returns proper object', () => {
      let get_started = new GetStartedButton('USER_DEFINED_PAYLOAD');
      expect(get_started).to.deep.equal({
        'setting_type':'call_to_actions',
        'thread_state':'new_thread',
        'call_to_actions':[
          {
            'payload':'USER_DEFINED_PAYLOAD'
          }
        ]
      });
    });
  });

  describe('persistent menu item', () => {
    it('works for postbacks', () => {
      let item = new PersistentMenuItem({
        type: 'postback',
        title: 'Help',
        payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_HELP'
      });
      expect(item).to.deep.equal({
        type: 'postback',
        title: 'Help',
        payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_HELP'
      });
    });

    it('works for web urls', () => {
      let item = new PersistentMenuItem({
        type: 'web_url',
        title: 'Help',
        url: 'http://facebook.com'
      });
      expect(item).to.deep.equal({
        type: 'web_url',
        title: 'Help',
        url: 'http://facebook.com'
      });
    });

    it('it errors on invalid type', () => {
      expect(() => {
        new PersistentMenuItem({
          type: 'wrong',
          title: 'Help',
          payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_HELP'
        });
      }).to.throw('Invalid type provided.');
    });

    it('it errors on title too long', () => {
      expect(() => {
        new PersistentMenuItem({
          type: 'postback',
          title: 'x'.repeat(31),
          payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_HELP'
        });
      }).to.throw('Title cannot be longer 30 characters.');
    });

    it('it errors on payload too long', () => {
      expect(() => {
        new PersistentMenuItem({
          type: 'postback',
          title: 'title',
          payload: 'x'.repeat(1001)
        });
      }).to.throw('Payload cannot be longer 1000 characters.');
    });

    it('it errors if web_url and no url provided', () => {
      expect(() => {
        new PersistentMenuItem({
          type: 'web_url',
          title: 'title'
        });
      }).to.throw('`url` must be supplied for `web_url` type menu items.');
    });

    it('it errors if postback and no payload provided', () => {
      expect(() => {
        new PersistentMenuItem({
          type: 'postback',
          title: 'title'
        });
      }).to.throw('`payload` must be supplied for `postback` type menu items.');
    });
  });

  describe('persistent menu', () => {
    it('works', () => {
      let item_1 = new PersistentMenuItem({
        type: 'postback',
        title: 'Help',
        payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_HELP'
      });

      let item_2 = new PersistentMenuItem({
        type: 'web_url',
        title: 'Help',
        url: 'http://facebook.com'
      });

      let menu = new PersistentMenu([item_1, item_2]);
      expect(menu).to.deep.equal({
        setting_type: 'call_to_actions',
        thread_state: 'existing_thread',
        call_to_actions: [
          {
            type: 'postback',
            title: 'Help',
            payload: 'DEVELOPER_DEFINED_PAYLOAD_FOR_HELP'
          },
          {
            type: 'web_url',
            title: 'Help',
            url: 'http://facebook.com'
          }
        ]
      });

    });

    describe('instantiation with non array', () => {
      it('throws error', () => {
        expect(() => {
          new PersistentMenu('payload');
        }).to.throw('You must pass an array of PersistentMenuItem objects.');
      });
    });

    describe('too many items', () => {
      it('throws error', () => {
        expect(() => {
          new PersistentMenu(new Array(6));
        }).to.throw('You cannot have more than 5 menu items.');
      });
    });

  });

});

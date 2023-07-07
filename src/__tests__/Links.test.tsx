import links from '../data/links';

describe('links', () => {
  it('contains the correct number of elements', () => {
    expect(links).toHaveLength(6);
  });

  it('contains elements with the correct shape and values', () => {
    links.forEach((link) => {
      expect(link).toMatchObject({
        href: expect.any(String),
        target: '_blank',
        size: '24',
        content: expect.any(Object),
        text: expect.any(String),
        viewBox: expect.any(String),
      });
    });
  });
});

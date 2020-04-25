const { accounts, defaultSender, contract, web3 } = require('@openzeppelin/test-environment');
const { singletons } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const TestERC20 = contract.fromArtifact('TestERC20');
const WrapperFactory = contract.fromArtifact('WrapperFactory');
const Wrapped777 = contract.fromArtifact('Wrapped777');

const { toWei } = web3.utils;
const [user] = accounts;

const str = promise => promise.then(result => result.toString())

describe('Wrapped777', () => {
  before(() => singletons.ERC1820Registry(defaultSender));

  it('Should wrap an ERC20 token and unwrap it', async () => {
    const token = await TestERC20.new();
    const factory = await WrapperFactory.new();

    await factory.create(token.address);
    const wrapperAddress = await factory.getWrapper(token.address);
    const wrapper = await Wrapped777.at(wrapperAddress);

    expect(await str(token.balanceOf(defaultSender))).to.equal(toWei('100', 'ether'));
    expect(await str(wrapper.balanceOf(defaultSender))).to.equal('0');

    await token.approve(wrapperAddress, toWei('10', 'ether'));
    await wrapper.wrap(toWei('10', 'ether'));

    expect(await str(token.balanceOf(defaultSender))).to.equal(toWei('90', 'ether'));
    expect(await str(wrapper.balanceOf(defaultSender))).to.equal(toWei('10', 'ether'));

    await wrapper.transfer(user, toWei('10', 'ether'));
    await wrapper.transfer(wrapper.address, toWei('10', 'ether'), { from: user });

    expect(await str(token.balanceOf(user))).to.equal(toWei('10', 'ether'));
  });

  it('Should wrap an Dai and unwrap it');
  it('Should wrap USDC and unwrap it');
});